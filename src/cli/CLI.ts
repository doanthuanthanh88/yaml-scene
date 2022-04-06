import { LoggerManager } from "@app/singleton/LoggerManager";
import chalk from "chalk";
import { program } from "commander";
import { readFileSync, statSync } from "fs";
import merge from "lodash.merge";
import { join } from "path";
import { ElementFactory } from "../elements/ElementFactory";
import { ExtensionManager } from "../singleton/ExtensionManager";
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
          const isOK = await this.installExtensions(extensionNames)
          if (isOK) {
            const jsonSchema = new JSONSchema()
            await jsonSchema.init()
            await jsonSchema.merge(join(__dirname, '../../schema.yas.json'))
            const extensions = []
            for (const extensionNameFullVer of extensionNames) {
              const [extensionName] = extensionNameFullVer.split('@')
              try {
                const extension = ExtensionManager.Instance.load(`${extensionName}/schema.json`) || {}
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
          const isOK = await this.upgradeExtensions(extensionNames)
          if (isOK) {
            const jsonSchema = new JSONSchema()
            await jsonSchema.init()
            await jsonSchema.merge(join(__dirname, '../../schema.yas.json'))
            const extensions = []
            for (const extensionNameFullVer of extensionNames) {
              const [extensionName] = extensionNameFullVer.split('@')
              try {
                const extension = ExtensionManager.Instance.load(`${extensionName}/schema.json`) || {}
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
          const isOK = await this.uninstallExtensions(extensionNames)
          if (isOK) {
            const jsonSchema = new JSONSchema()
            await jsonSchema.init()
            await jsonSchema.merge(join(__dirname, '../../schema.yas.json'))
            let isRemoved: boolean = false
            for (const extensionNameFullVer of extensionNames) {
              const [extensionName] = extensionNameFullVer.split('@')
              try {
                jsonSchema.removeSchema(extensionName)
                isRemoved = true
              } catch { }
            }
            if (isRemoved) {
              const fout = await jsonSchema.save()
              LoggerManager.GetLogger().info(chalk.green(`Yaml-scene scheme is updated. "${chalk.bold(fout)}"`))
            }
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
              .split('\\\n  ')
              .map(e => e.trim())
              .filter(e => e && !e.startsWith('#'))
              .forEach(e => {
                const idx = e.indexOf('=')
                env[e.substring(0, idx).trim().toLowerCase()] = e.substring(idx + 1).trim()
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

  async uninstallExtensions(extensionNames: string[]) {
    extensionNames = extensionNames.map(e => e.trim()).filter(e => e)
    if (!extensionNames) return false
    await ExtensionManager.UninstallPackage({
      dependencies: extensionNames
    })
    return true
  }

  async upgradeExtensions(extensionNames: string[]) {
    extensionNames = extensionNames.map(e => e.trim()).filter(e => e)
    if (!extensionNames) return false
    await ExtensionManager.UpgradePackage({
      dependencies: extensionNames
    })
    return true
  }

  async installExtensions(extensionNames: string[], customPath?: string, installType = 'global' as 'local' | 'global', isForce = false as boolean) {
    extensionNames = extensionNames.map(e => e.trim()).filter(e => e)
    if (!extensionNames) return false

    if (!isForce) {
      const confirmType = ElementFactory.CreateElement('UserInput')
      const choices = []
      if (installType === 'global') {
        choices.push({ title: `Global (Recommend)`, value: 'global', description: 'Install in global directory of "yarn" OR "npm"' })
      }
      choices.push({ title: `Local${installType === 'local' ? ' (Recommend)' : ''}`, value: 'local', description: `Install in "${customPath || 'yaml-scene'}"` })

      confirmType.init([{
        title: `Install ${extensionNames.map(e => chalk.yellow(`"${e}"`)).join(', ')} to:`,
        type: 'select',
        default: installType,
        choices,
        var: 'installType'
      }])
      await confirmType.prepare()
      const type = await confirmType.exec()
      installType = type.installType
      await confirmType.dispose()

      if (!installType) return false
    }
    await ExtensionManager.InstallPackage(
      installType === 'local' ? {
        localPath: customPath,
        dependencies: extensionNames,
        global: false,
        isSave: false,
      } : {
        dependencies: extensionNames,
        global: true,
      })
    return true
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
            const idx = e.indexOf("=");
            if (idx !== -1) sum[e.substring(0, idx)] = e.substring(idx + 1);
          }
          return sum;
        }, {} as { [key: string]: string });
    }
  }

}
