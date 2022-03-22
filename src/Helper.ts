import { program } from "commander";
import { existsSync, readFileSync, statSync } from "fs";
import merge from "lodash.merge";
import { join } from "path";
import { Extensions } from "./utils/extensions";

export class Helper {
  yamlFile: string
  password: string
  env: any
  envFile = '.env'
  extensions = []

  async exec() {
    const packageJson = [
      join(__dirname, "../package.json"),
      join(__dirname, "./package.json"),
    ].find((src) => existsSync(src));
    const { version, description, name, bin, repository } = require(packageJson);
    const self = this
    let isRunScenario = true
    const cmd = await program
      .name(name)
      .aliases(Object.keys(bin).filter(e => e !== name))
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
          .description('Execute a scenario file (Default)')
          .action((_, cmd) => {
            [this.yamlFile, this.password] = cmd.args
          }),
        { isDefault: true, hidden: true }
      )
      .addCommand(
        program
          .createCommand('add')
          .description('Add a new extension')
          .action(async (_, { args }) => {
            const extensionNames = (args || []).map(e => e.trim()).filter(e => e)
            await Extensions.InstallPackage({
              extensions: extensionNames
            })
            isRunScenario = false
          })
        , { isDefault: false })
      .addHelpText("after", `More: \n  ${repository.url} `)
      .parseAsync(process.argv)
    if (!isRunScenario) return false
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
              if (idx !== -1) sum[e.substring(0, idx)] = e.substring(idx + 1);
            }
            return sum;
          }, {});
      }
    }
    return true
  }

  loadEnv(baseConfig: any, ...files: object[] | string[]) {
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
              .split('\n')
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

}
