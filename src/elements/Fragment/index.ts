import { ExtensionManager } from "@app/singleton/ExtensionManager";
import { LogLevel } from "@app/singleton/LoggerManager";
import { VariableManager } from "@app/singleton/VariableManager";
import { YAMLSchema } from "@app/tags";
import { MD5 } from "@app/utils/encrypt/MD5";
import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import chalk from "chalk";
import { load } from "js-yaml";
import merge from 'lodash.merge';
import { basename, dirname, join } from "path";
import { ElementFactory } from "../ElementFactory";
import { IFileReader } from "../File/reader/IFileReader";
import { PasswordReader } from "../File/reader/PasswordReader";
import { ResourceReader } from "../File/reader/ResourceReader";
import { TextReader } from "../File/reader/TextReader";
import { FileWriter } from "../File/writer/FileWriter";
import { PasswordWriter } from "../File/writer/PasswordWriter";
import Group from "../Group";
import UserInput from "../UserInput";

const SALTED_PASSWORD = '|-YAML-SCENE-|'

/*****
@name Fragment
@description Import a scenario file (URL or file local) in the scenario.
@example
- Fragment: http://raw.github.../scenario1.yas.yaml

@example
- Fragment: 
    file: ./scenario1.yas.yaml
    password: $PASS_TO_DECRYPT
    title: Override title in scenario
    description: ""                       # Hide description in scenario
    logLevel: slient                      # hide logger in scenario
    vars:                                 # Override variables value which is only declared in `vars` in the scenario file
      varInScenario1: override here
*/
export default class Fragment extends Group {
  file: string
  password?: string
  vars?: any

  scenarioPasswordFile: string

  override init(props: { file: string, password?: string, logLevel?: LogLevel, vars?: any } | string) {
    if (typeof props === 'string') {
      this.file = props
    } else {
      merge(this, props)
    }
  }

  override async prepare() {
    await this.proxy.applyVars(this, 'file')
    this.file = this.proxy.resolvePath(this.file)
    if (!FileUtils.Existed(this.file)) {
      throw new TraceError(`Scenario file "${this.file}" is not found`)
    }

    const { vars, title, description, steps, logLevel, extensions, install } = await this.getScenarioFile()

    if (vars) {
      await this.declareAndInit(vars)
    }
    if (this.vars) {
      await this.proxy.replaceVar(this.vars)
    }
    // Load extensions
    if (extensions) await ExtensionManager.Instance.registerGlobalExtension(extensions)
    if (install) await ExtensionManager.Instance.install(install)
    const { file: _file, vars: _vars, ...props } = this
    super.init(merge({
      title,
      description,
      steps,
    }, props, {
      logLevel: await this.proxy.getVar(logLevel),
    }))
    await super.prepare()
  }

  async declareAndInit(vars: any) {
    VariableManager.Instance.declare(vars)
    await this.proxy.setVar(vars)
  }

  clean() {
    this.password && FileUtils.RemoveFilesDirs(this.scenarioPasswordFile)
  }

  private async getScenarioFile() {
    if (typeof this.file !== 'string') throw new TraceError('Scenario must be a path of file')

    const existed = FileUtils.Existed(this.file)
    if (!existed) throw new TraceError(`Scenario file is not existed at "${this.file}"`)

    let reader: IFileReader
    let scenarioObject: any
    let fileContent: string
    const resource = new ResourceReader(this.file)
    let isLoaded: boolean

    do {
      if (isLoaded) isLoaded = false
      if (this.password) {
        reader = new PasswordReader(resource, this.getPassword(this.password))
      } else {
        reader = resource
      }
      reader = new TextReader(reader)

      let enterPassword: boolean
      try {
        fileContent = await reader.read()
        scenarioObject = load(fileContent, {
          schema: YAMLSchema.Schema
        }) as any
        if (typeof scenarioObject === 'string') {
          const parts = fileContent?.split(':')
          if (parts?.length === 2 && parts[0].length === 32) {
            enterPassword = true
          }
        }
      } catch {
        this.proxy.logger.error(chalk.red(`✗ Password is not valid`))
        enterPassword = true
      }
      if (enterPassword) {
        const inputPassword = ElementFactory.CreateTheElement<UserInput>(UserInput)
        inputPassword.init([{
          title: `Enter password to decrypted ${chalk.gray(`"${this.file}"`)}`,
          type: 'password',
          required: true,
          var: 'pwd'
        }])
        await inputPassword.prepare()
        const { pwd } = await inputPassword.exec()
        await inputPassword.dispose()
        this.password = pwd
        isLoaded = true
      }
    } while (isLoaded)

    if (Array.isArray(scenarioObject)) {
      scenarioObject = { steps: scenarioObject.flat() }
    }
    if (typeof scenarioObject !== 'object') throw new TraceError('Scenario must be an object or array', { scenarioObject })

    const { password: pwd, ...scenarioProps } = scenarioObject
    if (!scenarioProps) throw new TraceError('File scenario is not valid', { scenarioObject })

    if (pwd && resource.isFile) {
      const name = basename(this.file)
      this.scenarioPasswordFile = join(dirname(this.file), name.split('.', 1)[0])

      this.password = this.getPassword(pwd)
      const writer = new PasswordWriter(new FileWriter(this.scenarioPasswordFile), this.password)
      await writer.write(fileContent.replace(/^password:.+$/m, ''))
    }

    return scenarioProps
  }

  private getPassword(password?: string) {
    return password && MD5.Instance.encrypt(`${SALTED_PASSWORD}${password}`)
  }

}