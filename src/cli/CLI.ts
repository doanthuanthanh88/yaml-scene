import { InstallationManager } from "@app/singleton/InstallationManager";
import { LoggerManager } from "@app/singleton/LoggerManager";
import { StringUtils } from "@app/utils/StringUtils";
import chalk from "chalk";
import { program } from "commander";
import { readFileSync, statSync } from "fs";
import merge from "lodash.merge";
import { join } from "path";
import { JSONSchema } from "./JSONSchema";

export class CLI {
  private static _Instance: CLI

  static get Instance() {
    return this._Instance || (this._Instance = new CLI())
  }

  yamlFile: string
  password: string
  env: any
  envFile = '.env'

  version: string
  description: string
  name: string
  bin: object
  repositoryURL
  force: boolean

  get latestVersion() {
    return this.version.split('.', 1)[0]
  }

  constructor() {
    this.envFile = '.env'
    const { version, description, name, bin, repository } = require(join(__dirname, "../../package.json"))
    this.version = version
    this.description = description
    this.name = name
    this.bin = bin
    this.repositoryURL = repository.url
  }

  async exec() {
    let isRunScenario = true
    await program
      .name(this.name)
      .aliases(Object.keys(this.bin).filter(e => e !== this.name))
      .description(this.description)
      .version(this.version, "-v, --version")
      .argument("[file]", "Scenario path or file", "index.yas.yaml")
      .argument("[password]", "Password to decrypt scenario file")
      .enablePositionalOptions(true)
      .passThroughOptions(true)
      .showHelpAfterError(true)
      .option("-f, --force", `Auto install miss packages/extensions without confirm`)
      .option("--env-file <string>", `Environment variables file`)
      .option(
        "-e, --env <csv|json>", `Environment variables.    
                         + csv: key1=value1;key2=value2
                         + json: {"key1": "value1", "key2": "value2"}`
      )
      .action((file, pwd, opts) => {
        this.yamlFile = file
        this.password = pwd
        this.envFile = opts.envFile;
        this.env = this.parseEnv(opts.env)
        this.force = opts.force;
      })
      .addCommand(program
        .createCommand('schema')
        .description('Merge schemas of extensions')
        .argument("<urls...>", "Schema.json files")
        .option("-f, --mainFile <string>", `Yaml-schema json schema`)
        .action(async (urls: string[], opts: any) => {
          const jsonSchema = new JSONSchema()
          await jsonSchema.init(opts['mainFile'])
          await jsonSchema.addSchema(...urls)
          const fout = await jsonSchema.save()
          LoggerManager.GetLogger().info(chalk.green(`Yaml-scene scheme is generated. "${chalk.bold(fout)}"`))
          isRunScenario = false
        }), { hidden: true }
      )
      .addCommand(program
        .createCommand('add')
        .description('Add new extensions')
        .argument("<extensions...>", "ExtensionManager package in npm registry")
        .action(async (extensionNames) => {
          extensionNames = extensionNames.map(extensionName => extensionName.includes('@') ? extensionName : `${extensionName}@${this.latestVersion}`)
          await InstallationManager.Instance.installExtensions(extensionNames, undefined, 'global', true)
          const jsonSchema = new JSONSchema()
          await jsonSchema.init()
          await jsonSchema.merge(join(__dirname, '../../schema.yas.json'))
          const extensions = []
          for (const extensionNameFullVer of extensionNames) {
            const [extensionName] = extensionNameFullVer.split('@', 1)
            try {
              const extension = require(`${extensionName}/schema.json`) || {}
              if (Object.keys(extension).length) {
                extensions.push(extension)
              }
            } catch { }
          }
          if (extensions.length) {
            await jsonSchema.addSchema(...extensions)
            const fout = await jsonSchema.save()
            LoggerManager.GetLogger().info(chalk.green(`Yaml-scene scheme is updated. "${chalk.bold(fout)}"`))
          }
          isRunScenario = false
        })
      )
      .addCommand(program
        .createCommand('upgrade')
        .aliases(['up'])
        .description('Upgrade extensions version. Default is `yaml-scene`')
        .argument("[extensions...]", "ExtensionManager package in npm registry")
        .action(async (extensionNames) => {
          if (!extensionNames.length) extensionNames.push('yaml-scene')
          extensionNames = extensionNames.map(extensionName => extensionName.includes('@') ? extensionName : `${extensionName}@${this.latestVersion}`)
          console.log(extensionNames)
          await InstallationManager.Instance.upgradeExtensions(extensionNames)
          const jsonSchema = new JSONSchema()
          await jsonSchema.init()
          await jsonSchema.merge(join(__dirname, '../../schema.yas.json'))
          const extensions = []
          for (const extensionNameFullVer of extensionNames) {
            const [extensionName] = extensionNameFullVer.split('@', 1)
            try {
              const extension = require(`${extensionName}/schema.json`) || {}
              if (Object.keys(extension).length) {
                extensions.push(extension)
              }
            } catch { }
          }
          if (extensions.length) {
            await jsonSchema.addSchema(...extensions)
            const fout = await jsonSchema.save()
            LoggerManager.GetLogger().info(chalk.green(`Yaml-scene scheme is updated. "${chalk.bold(fout)}"`))
          }
          isRunScenario = false
        })
      )
      .addCommand(program
        .createCommand('remove')
        .aliases(['rm'])
        .description('Remove the extensions')
        .argument("<extensions...>", "ExtensionManager package in npm registry")
        .action(async (extensionNames) => {
          await InstallationManager.Instance.uninstallExtensions(extensionNames)
          const jsonSchema = new JSONSchema()
          await jsonSchema.init()
          await jsonSchema.merge(join(__dirname, '../../schema.yas.json'))
          let isRemoved: boolean = false
          for (const extensionNameFullVer of extensionNames) {
            const [extensionName] = extensionNameFullVer.split('@', 1)
            try {
              jsonSchema.removeSchema(extensionName)
              isRemoved = true
            } catch { }
          }
          if (isRemoved) {
            const fout = await jsonSchema.save()
            LoggerManager.GetLogger().info(chalk.green(`Yaml-scene scheme is updated. "${chalk.bold(fout)}"`))
          }
          isRunScenario = false
        })
      )
      .addHelpText("after", `More:
✔ Github project: ${this.repositoryURL} 
✔ Npm package   : https://www.npmjs.com/package/yaml-scene
✔ Docker Image  : https://hub.docker.com/repository/docker/doanthuanthanh88/yaml-scene
`)
      .parseAsync(process.argv)
    return isRunScenario
  }

  loadEnv(baseConfig: any, ...files: (any | string)[]) {
    const castToObject = function (obj: { [key: string]: any }, pro: { [key: string]: any }, prefix: string) {
      for (let k in obj) {
        if (typeof obj[k] === 'function' || k.startsWith('$$')) continue
        if (typeof obj[k] === 'object') {
          obj[k] = castToObject(obj[k], pro, (prefix + k + '_').toLowerCase())
        } else if (Array.isArray(obj[k])) {
          for (let i in obj[k]) {
            obj[k][i] = castToObject(obj[k][i], pro, (prefix + k + '_' + i + '_').toLowerCase())
          }
        } else {
          let lk = prefix + k.toLowerCase().replace('.', '_')
          if (pro[lk] !== undefined && obj[k] !== undefined) {
            if (typeof obj[k] === 'boolean') {
              switch (pro[lk]) {
                case 'true':
                  obj[k] = true
                  break
                case '1':
                  obj[k] = true
                  break
                case 'yes':
                  obj[k] = true
                  break
                case 'false':
                  obj[k] = false
                  break
                case '0':
                  obj[k] = false
                  break
                case 'no':
                  obj[k] = false
                  break
                default:
                  obj[k] = new Boolean(pro[lk]).valueOf()
                  break
              }
            } else if (typeof obj[k] === 'number') {
              obj[k] = +pro[lk]
            } else {
              obj[k] = pro[lk]
            }
          }
        }
      }
      return obj
    }

    const config = {}
    files.forEach(file => {
      if (!file) return
      if (typeof file === 'string') {
        let env = {} as { [key: string]: string }
        try {
          if (file && statSync(file)) {
            readFileSync(file)
              .toString()
              .split('\n')
              .map(e => e.trim())
              .filter(e => e && !e.startsWith('#'))
              .forEach(e => {
                const [key, vl] = StringUtils.Split2(e, '=')
                env[key.trim().toLowerCase()] = vl.trim()
              })
          }
        } catch (err) {
          LoggerManager.GetLogger().warn(chalk.yellow('⚠️', `Could not found config file at ${file}`))
        }
        merge(config, env)
      } else {
        merge(config, Object.keys(file).reduce((sum, e) => {
          sum[e.toLowerCase()] = file[e]
          return sum
        }, {} as { [key: string]: any }))
      }
    })
    castToObject(baseConfig, config, '')
    if (baseConfig.NODE_ENV) process.env.NODE_ENV = baseConfig.NODE_ENV
    return baseConfig
  }

  private parseEnv(env: string | any) {
    if (!env || typeof env !== "string") return env
    try {
      return JSON.parse(env);
    } catch {
      return env
        .trim()
        .split(";")
        .reduce((sum, e) => {
          e = e.trim();
          if (e) {
            const [key, vl] = StringUtils.Split2(e, '=')
            sum[key] = vl
          }
          return sum;
        }, {} as { [key: string]: string });
    }
  }

}
