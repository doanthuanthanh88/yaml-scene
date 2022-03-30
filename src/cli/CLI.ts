import { LoggerManager } from "@app/singleton/LoggerManager";
import chalk from "chalk";
import { program } from "commander";
import { readFileSync, statSync } from "fs";
import merge from "lodash.merge";
import { basename, join, resolve } from "path";
import { ElementFactory } from "../elements/ElementFactory";
import Exec from "../elements/Exec";
import { ExtensionManager } from "../singleton/ExtensionManager";
import { JSONSchema } from "./JSONSchema";

export class CLI {
  yamlFile: string
  password: string
  env: any
  envFile = '.env'

  constructor() {
    this.envFile = '.env'
  }

  async exec() {
    const packageJson = join(__dirname, "../../package.json")
    const { version, description, name, bin, repository } = require(packageJson);
    let isRunScenario = true
    await program
      .name(name)
      .aliases(Object.keys(bin).filter(e => e !== name))
      .description(description)
      .version(version, "-v, --version")
      .argument("<file>", "Scenario path or file", undefined, "index.yas.yaml")
      .argument("[password]", "Password to decrypt scenario file")
      .enablePositionalOptions(true)
      .passThroughOptions(true)
      .option("--env-file <string>", `Environment variables file`)
      .option(
        "-e, --env <csv|json>", `Environment variables.    
                         + csv: key1=value1;key2=value2
                         + json: {"key1": "value1", "key2": "value2"}`
      )
      // .showHelpAfterError(true)
      .action((file, pwd, opts) => {
        this.yamlFile = file
        this.password = pwd
        this.envFile = opts.envFile;
        this.env = this.parseEnv(opts.env)
      })
      .addCommand(program
        .createCommand('docker')
        .description('Run via docker')
        .argument("<file>", "Scenario path or file")
        .argument("[password]", "Password to decrypt scenario file")
        .option("-n, --name <string>", `Container name. Reused an existed container`)
        .option("-d, --dir <string>", `Directory includes scenarios`)
        .option("-ex, --extensions <string>", `External extensions which need to be installed. Separate by space " "`)
        .option("--env-file <string>", `Environment variables file`)
        .option("-e, --env <csv|json>", `Environment variables.    
                             + csv: key1=value1;key2=value2
                             + json: {"key1": "value1", "key2": "value2"}`)
        .action(async (file = '', password = '', options) => {
          await this.runDocker(file, password, options)
          isRunScenario = false
        })
      )
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
        })
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
            let extensions = []
            for (const extensionNameFullVer of extensionNames) {
              const [extensionName] = extensionNameFullVer.split('@')
              try {
                const extension = ExtensionManager.Instance.load(`${extensionName}/schema.json`, undefined, null)
                extensions.push(extension)
              } catch { }
            }
            await jsonSchema.addSchema(...extensions)
            const fout = await jsonSchema.save()
            LoggerManager.GetLogger().info(chalk.green(`Yaml-scene scheme is updated. "${chalk.bold(fout)}"`))
          }
          isRunScenario = false
        })
      )
      .addCommand(program
        .createCommand('upgrade')
        .aliases(['up', 'update'])
        .description('Upgrade `yaml-scene` or extensions')
        .argument("[extensions...]", "ExtensionManager package in npm registry")
        .action(async (extensionNames) => {
          if (!extensionNames.length) extensionNames.push('yaml-scene')
          const isOK = await this.upgradeExtensions(extensionNames)
          if (isOK) {
            const jsonSchema = new JSONSchema()
            await jsonSchema.init()
            await jsonSchema.merge(join(__dirname, '../../schema.yas.json'))
            let extensions = []
            for (const extensionNameFullVer of extensionNames) {
              const [extensionName] = extensionNameFullVer.split('@')
              try {
                const extension = ExtensionManager.Instance.load(`${extensionName}/schema.json`, undefined, null)
                extensions.push(extension)
              } catch { }
            }
            await jsonSchema.addSchema(...extensions)
            const fout = await jsonSchema.save()
            LoggerManager.GetLogger().info(chalk.green(`Yaml-scene scheme is updated. "${chalk.bold(fout)}"`))
          }
          isRunScenario = false
        })
      )
      .addCommand(program
        .createCommand('remove')
        .description('Remove the extensions')
        .argument("<extensions...>", "ExtensionManager package in npm registry")
        .action(async (extensionNames) => {
          const isOK = await this.uninstallExtensions(extensionNames)
          if (isOK) {
            const jsonSchema = new JSONSchema()
            await jsonSchema.init()
            await jsonSchema.merge(join(__dirname, '../../schema.yas.json'))
            for (const extensionNameFullVer of extensionNames) {
              const [extensionName] = extensionNameFullVer.split('@')
              try {
                jsonSchema.removeSchema(extensionName)
              } catch { }
            }
            const fout = await jsonSchema.save()
            LoggerManager.GetLogger().info(chalk.green(`Yaml-scene scheme is updated. "${chalk.bold(fout)}"`))
          }
          isRunScenario = false
        })
      )
      .addHelpText("after", `More:
✔ Github project: ${repository.url} 
✔ Npm package   : https://www.npmjs.com/package/yaml-scene
✔ Docker Image  : https://hub.docker.com/repository/docker/doanthuanthanh88/yaml-scene
`)
      .parseAsync(process.argv)
    return isRunScenario
  }

  loadEnv(baseConfig: any, ...files: (object | string)[]) {
    const castToObject = function (obj, pro, prefix) {
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
        let env = {}
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
          console.warn(`Could not found config file at ${file}`)
        }
        merge(config, env)
      } else {
        merge(config, Object.keys(file).reduce((sum, e) => {
          sum[e.toLowerCase()] = file[e]
          return sum
        }, {}))
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

  async installExtensions(extensionNames: string[]) {
    extensionNames = extensionNames.map(e => e.trim()).filter(e => e)
    if (!extensionNames) return false
    const confirmType = ElementFactory.CreateElement('UserInput')
    confirmType.init([{
      title: `Install ${extensionNames.map(e => chalk.yellow(`"${e}"`)).join(', ')} to:`,
      type: 'select',
      default: 'global',
      choices: [
        { title: `Global - Installed to global npm or yarn `, value: 'global' },
        { title: 'Local - Installed into "yaml-scene". When "yaml-scene" is reinstalled or upgraded, these extensions must be reinstalled', value: 'local' }
      ],
      var: 'installType'
    }])
    confirmType.prepare()
    const { installType } = await confirmType.exec()
    await confirmType.dispose()

    if (!installType) return false
    await ExtensionManager.InstallPackage(installType === 'local' ? {
      dependencies: extensionNames,
      global: false,
      isSave: false,
    } : {
      dependencies: extensionNames,
      global: true,
    })
    return true
  }

  private async runDocker(file: string, password: string, options: any) {
    let { dir, extensions, env, envFile, name } = options
    const prms = []
    let fileRun = ''
    let rm = []
    if (!name) {
      name = `yas-${basename(file)}`
      rm = ['--rm']
    }
    if (dir) {
      prms.push('-v', `"${resolve(dir)}:/test"`, '\\\n  ')
      fileRun = join('/test', file)
    } else {
      const filename = basename(file)
      prms.push('-v', `"${resolve(file)}:/test/${filename}"`, '\\\n  ')
      fileRun = join('/test', filename)
    }
    if (envFile) {
      prms.push('--env-file', `"${resolve(envFile)}"`, '\\\n  ')
    }
    if (extensions) {
      prms.push('-e', `"EXTENSIONS=${extensions}"`, '\\\n  ')
    }
    if (env) {
      const envObject = this.parseEnv(env)
      prms.push(...Object.keys(envObject).map(key => ['-e', `"${key}=${envObject[key]}"`, '\\\n  ']).flat())
    }
    prms.push("doanthuanthanh88/yaml-scene", '\\\n  ')
    prms.push(fileRun)
    if (password) prms.push(`"${password}"`)
    const cmd = ['docker', 'run', ...rm, '-it', '--name', `"${name}"`, '\\\n  ', ...prms]
    LoggerManager.GetLogger().info(chalk.magenta(cmd.join(' ')))
    const confirm = ElementFactory.CreateElement('UserInput')
    confirm.init([{
      title: 'Run now ?',
      type: 'confirm',
      default: true,
      var: 'isRun'
    }])
    confirm.prepare()
    const cmds = cmd.filter(e => e !== '\\\n  ').map(e => e.replace(/^"|"$/g, ""))
    const { isRun } = await confirm.exec()
    await confirm.dispose()
    if (isRun) {
      Exec.Run(cmds)
    }
  }

  private parseEnv(env: any) {
    if (env && typeof env === "string") {
      try {
        env = JSON.parse(env);
      } catch {
        env = env
          .trim()
          .split(";")
          .reduce((sum, e) => {
            e = e.trim();
            if (e) {
              const idx = e.indexOf("=");
              if (idx !== -1) sum[e.substring(0, idx)] = e.substring(idx + 1);
            }
            return sum;
          }, {});
      }
    }
    return env
  }

}
