import { Resource } from '@app/elements/File/adapter/Resource'
import { LoggerManager } from '@app/singleton/LoggerManager'
import chalk from 'chalk'
import merge from 'lodash.merge'
import uniqWith from 'lodash.uniqwith'
import { join } from "path"
import { File } from "../elements/File/adapter/File"
import { Json } from "../elements/File/adapter/Json"
import { Scenario } from '../singleton/Scenario'
import { FileUtils } from '../utils/FileUtils'

export class JSONSchema {
  private templates: any
  private yamlScene: any
  private _removedKeyName: string

  get removedKeyName() {
    return this._removedKeyName || (this._removedKeyName = Math.random().toString())
  }

  async init(yamlSceneSchema = join(__dirname, '../../schema.json')) {
    yamlSceneSchema = Scenario.Instance.resolvePath(yamlSceneSchema)
    const { templates = {}, ...yamlScene } = await this.getFileData(yamlSceneSchema)
    this.templates = templates
    this.yamlScene = yamlScene
  }

  async merge(oldSchema: string) {
    oldSchema = Scenario.Instance.resolvePath(oldSchema)
    if (FileUtils.Existed(oldSchema)) {
      const json = await this.getFileData(oldSchema)
      merge(this.yamlScene, json)
    }
  }

  async addSchema(...schemaURLs: (string | object)[]) {
    for (let url of schemaURLs) {
      try {
        let json: any
        if (typeof url === 'object') {
          json = url
          LoggerManager.GetLogger().debug(chalk.yellow(`- Merging ${json.$id}...`))
        } else {
          url = Scenario.Instance.resolvePath(url)
          LoggerManager.GetLogger().debug(chalk.yellow(`- Merging ${url}...`))
          json = await this.getFileData(url)
        }
        console.group()
        try {
          const { templates = {}, $id, oneOf, anyOf, allOf, ...schema } = json
          this.injectAttrs(schema, merge(templates, this.templates))
          this.replaceID(schema, $id)
          const childs = (oneOf || anyOf || allOf || [])
          this.replaceID(childs, $id)
          this.yamlScene.definitions.allOfSteps.items.anyOf.push(...childs)
          this.yamlScene.definitions.allOfSteps.items.anyOf = uniqWith(this.yamlScene.definitions.allOfSteps.items.anyOf, (a: any, b: any) => { return a.$ref === b.$ref && a.$ref })
          this.yamlScene = merge({}, schema, this.yamlScene)
          LoggerManager.GetLogger().info(`✅ Done`)
        } finally {
          console.groupEnd()
        }
      } catch (err: any) {
        LoggerManager.GetLogger().warn(chalk.yellow('⚠️', err?.message))
      }
    }
  }

  removeSchema(...extensionNames: string[]) {
    extensionNames.forEach(extensionName => this.removeID(this.yamlScene, extensionName))
  }

  parse() {
    this.injectAttrs(this.yamlScene, this.templates)
  }

  async save(fout = join(__dirname, '../../schema.yas.json')) {
    fout = Scenario.Instance.resolvePath(fout)
    this.parse()
    const f = new Json(new File(fout), { pretty: true })
    await f.write(this.yamlScene)
    return fout
  }

  private async getFileData(urlOrPath: string) {
    const resource = new Resource(urlOrPath)
    const content = await resource.read()
    return JSON.parse(content.toString())
  }

  private removeID(obj: { [key: string]: any } | { [key: string]: any }[], $id: string) {
    if (Array.isArray(obj)) {
      for (let i = obj.length - 1; i >= 0; i--) {
        if (typeof obj[i] === 'object') {
          this.removeID(obj[i], $id)
          if (obj[i][this.removedKeyName]) {
            obj.splice(i, 1)
          }
        }
      }
    } else if (typeof obj === 'object') {
      Object.entries(obj).forEach(([key, vl]) => {
        if (new RegExp(`^${$id}[^a-zA-Z0-9]+`).test(key)) {
          delete obj[key]
        } else if (key === '$ref') {
          if (new RegExp(`^#/definitions/${$id}[^a-zA-Z0-9]+`).test(vl.toString()))
            obj[this.removedKeyName] = true
        }
        if (typeof vl === 'object') {
          this.removeID(vl, $id)
        }
      })
    }
  }

  private replaceID(obj: { [key: string]: any } | { [key: string]: any }[], $id: string) {
    if (Array.isArray(obj)) {
      obj.forEach(o => typeof o === 'object' && this.replaceID(o, $id))
    } else if (typeof obj === 'object') {
      Object.entries(obj).forEach(([k, vl]) => {
        let key = k
        if (key.includes('$id') && key !== '$id') {
          key = key.replace(/\$id/g, $id)
          obj[key] = vl
          delete obj[k]
        } else if (key === '$ref') {
          obj[key] = vl.toString().replace(/\$id/g, $id)
        }
        if (typeof vl === 'object') {
          this.replaceID(vl, $id)
        }
      })
    }
  }

  private injectAttrs(obj: { [key: string]: any } | { [key: string]: any }[], templates: any) {
    if (Array.isArray(obj)) {
      obj.forEach(o => typeof o === 'object' && this.injectAttrs(o, templates))
    } else if (typeof obj === 'object') {
      Object.entries(obj).forEach(([key, vl]) => {
        if (/^\.{3,}$/.test(key)) {
          const template = templates[vl.toString()]
          if (template !== undefined) {
            Object.assign(obj, template)
            delete obj[key]
          }
        }
        if (obj[key] && typeof obj[key] === 'object') {
          this.injectAttrs(obj[key], templates)
        }
      })
    }
  }
}