import chalk from 'chalk'
import http from 'http'
import https from 'https'
import { join } from "path"
import { File } from "./elements/File/adapter/File"
import { Json } from "./elements/File/adapter/Json"
import merge from 'lodash.merge'
import { readFileSync } from 'fs'
import { Scenario } from './singleton/Scenario'

export class JSONSchema {
  private templates: any
  private yamlScene: any

  constructor(public scenario: Scenario) { }

  async init(yamlSceneSchema: string) {
    const { templates = {}, ...yamlScene } = await new Json(new File(this.scenario.resolvePath(yamlSceneSchema))).read()
    this.templates = templates
    this.yamlScene = yamlScene
  }

  async addSchema(schemaURLs: string[]) {
    for (const url of schemaURLs) {
      try {
        console.log(chalk.yellow(`- Merging ${url}...`))
        console.group()
        let schema: any
        if (/^https?:\/\//.test(url)) {
          schema = await new Promise<any>((resolve, reject) => {
            const req = url.startsWith('https://') ? https : http
            req.get(url, response => {
              const data = []
              response.on('data', (chunk) => {
                data.push(chunk)
              })
              response.on('end', () => {
                resolve(JSON.parse(data.join('')))
              })
              response.on('error', reject)
            });
          })
        } else {
          schema = JSON.parse(readFileSync(this.scenario.resolvePath(url)).toString())
        }
        this.injectAttrs(schema)
        this.replaceID(schema, schema.$id)
        this.yamlScene.definitions.allOfSteps.items.anyOf.push(...(schema.oneOf || schema.anyOf || schema.allOf))
        this.yamlScene = merge({}, schema, this.yamlScene)
        console.log(`✅ Done`)
      } catch (err) {
        console.error(`❌ ${err.message}`)
      } finally {
        console.groupEnd()
      }
    }
  }

  parse() {
    this.injectAttrs(this.yamlScene)
  }

  async save(fout = join(__dirname, '../schema.yas.json')) {
    fout = this.scenario.resolvePath(fout)
    this.parse()
    const f = new Json(new File(fout))
    await f.write(this.yamlScene)
    return fout
  }

  private replaceID(obj, $id) {
    if (Array.isArray(obj)) {
      obj.forEach(o => typeof o === 'object' && this.replaceID(o, $id))
    } else if (typeof obj === 'object') {
      const keys = Object.keys(obj)
      keys.forEach(k => {
        let key = k
        if (key.includes('$id') && key !== '$id') {
          key = key.replace(/\$id/g, $id)
          obj[key] = obj[k]
          delete obj[k]
        } else if (key === '$ref') {
          obj[key] = obj[key].replace(/\$id/g, $id)
        }
        if (typeof obj[key] === 'object') {
          this.replaceID(obj[key], $id)
        }
      })
    }
  }

  private injectAttrs(obj) {
    if (Array.isArray(obj)) {
      obj.forEach(o => typeof o === 'object' && this.injectAttrs(o))
    } else if (typeof obj === 'object') {
      const keys = Object.keys(obj)
      keys.forEach(k => {
        let key = k
        if (/^\.{3,}$/.test(key)) {
          if (this.templates[obj[key]] !== undefined) {
            Object.assign(obj, this.templates[obj[key]])
            delete obj[key]
          }
        }
        if (obj[key] && typeof obj[key] === 'object') {
          this.injectAttrs(obj[key])
        }
      })
    }
  }
}