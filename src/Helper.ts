import { program } from "commander";
import { existsSync, readFileSync, statSync } from "fs";
import { merge } from "lodash";
import { join } from "path";

export class Helper {
  yamlFile: string
  password: string
  env: any
  envFile = '.env'
  externalModules = []

  constructor() {

  }

  async exec() {
    const packageJson = [
      join(__dirname, "../package.json"),
      join(__dirname, "./package.json"),
    ].find((src) => existsSync(src));
    const { version, description, name, repository } = require(packageJson);
    const self = this
    const cmd = await program
      .name(name)
      .description(description)
      .version(version, "-v, --version")
      .argument("<file>", "Scenario path or file", undefined, "index.yaml")
      .argument("[password]", "Password to decrypt scenario file")
      .enablePositionalOptions(true)
      .passThroughOptions(true)
      .option(
        "-ef --env-file <string>",
        `Environment variables file`
      )
      .option(
        "-e, --env <csv|json>",
        `Environment variables.    
                        + csv: key1=value1;key2=value2
                        + json: {"key1": "value1", "key2": "value2"}`
      )
      // .showHelpAfterError(true)
      .addCommand(
        program
          .createCommand('run')
          .description('Execute scenario file (Default)')
          .action((_, cmd) => {
            [this.yamlFile, this.password] = cmd.args
          }),
        { isDefault: true, hidden: true }
      )
      .addCommand(program
        .createCommand('help')
        .argument("[module_name]", "External module name")
        .description('Show external module helper')
        // .action(async (moduleName) => {
        //   // const [moduleName] = cmd.args
        //   if (!moduleName) {
        //     const { InputKeyboard } = await import("@app/elements/InputKeyboard");
        //     const input = new InputKeyboard()
        //     await input.init({
        //       title: `Standard external modules`,
        //       type: 'select',
        //       choices: this.externalModules.map(key => {
        //         return {
        //           title: `- ${chalk.bold(key)}`,
        //           value: key
        //         }
        //       })
        //     })
        //     await input.prepare()
        //     moduleName = await input.exec()
        //   }
        //   if (moduleName) {
        //     const { Require } = await import("@/components/Require");
        //     await Require.loadExternalLib(undefined, moduleName);
        //     const { Input } = await import("@/components/input/Input");
        //     const input = new Input()
        //     await input.init({
        //       title: `Show help`,
        //       type: 'select',
        //       choices: Object.keys(context.ExternalLibraries).map(key => {
        //         return {
        //           title: `- ${chalk.bold(key)}: ${chalk.italic(context.ExternalLibraries[key].des || '')}`,
        //           value: key
        //         }
        //       })
        //     })
        //     await input.prepare()
        //     await input.beforeExec()
        //     const clazz = await input.exec()
        //     if (context.ExternalLibraries[clazz]) {
        //       if (context.ExternalLibraries[clazz].example) {
        //         console.log(chalk.magenta(context.ExternalLibraries[clazz].example))
        //       } else {
        //         console.log(chalk.yellow('No example'))
        //       }
        //     }
        //   }
        //   process.exit(0)
        // })
      )
      .addHelpText("after", `More: \n  ${repository.url} `)
      .parseAsync(process.argv)

    self.env = cmd.opts().env;
    self.envFile = cmd.opts().envFile;
    if (self.env && typeof self.env === "string") {
      try {
        self.env = JSON.parse(self.env);
      } catch {
        self.env = self.env
          .trim()
          .split(";")
          .reduce((sum, e) => {
            e = e.trim();
            if (e) {
              const idx = e.indexOf("=");
              if (idx !== -1) sum[e.substr(0, idx)] = e.substr(idx + 1);
            }
            return sum;
          }, {});
      }
    }
  }

  loadEnv(baseConfig: any, ...files: object[] | string[]) {
    const castToObject = function (obj, pro, prefix) {
      for (let k in obj) {
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
            readFileSync(file).toString().split('\n').map(e => e.trim()).filter(e => e && !e.startsWith('#')).forEach(e => {
              env[e.substr(0, e.indexOf('=')).trim().toLowerCase()] = e.substr(e.indexOf('=') + 1).trim()
            })
          }
        } catch (err) {
          console.warn(`Could not found config file at ${file}`)
        }
        merge(config, env)
      } else {
        merge(config, file)
      }
    })
    merge(config, Object.keys(process.env).reduce((sum, e) => {
      sum[e.toLowerCase()] = process.env[e]
      return sum
    }, {}))
    castToObject(baseConfig, config, '')
    if (baseConfig.NODE_ENV) process.env.NODE_ENV = baseConfig.NODE_ENV
    return baseConfig
  }

}
