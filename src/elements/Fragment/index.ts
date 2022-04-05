import { ExtensionManager } from "@app/singleton/ExtensionManager";
import { LogLevel } from "@app/singleton/LoggerManager";
import { VariableManager } from "@app/singleton/VariableManager";
import { YAMLSchema } from "@app/tags";
import { MD5 } from "@app/utils/encrypt/MD5";
import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { load } from "js-yaml";
import merge from 'lodash.merge';
import { basename, dirname, join } from "path";
import { File } from "../File/adapter/File";
import { Password } from "../File/adapter/Password";
import { Resource } from "../File/adapter/Resource";
import Group from "../Group";

const SALTED_PASSWORD = '|-YAML-SCENE-|'

/**
 * @guide
 * @name Fragment
 * @description Import a scenario file (URL or file local) in the scenario.
 * @example
- Fragment: http://raw.github.../scenario1.yas.yaml

- Fragment: 
    file: ./scenario1.yas.yaml
    password: $PASS_TO_DECRYPT
    title: Override title in scenario
    description: ""                       # Hide description in scenario
    logLevel: slient                      # hide logger in scenario
    vars:
      varInScenario1: override here
 * @end
 */
export default class Fragment extends Group {
  file: string
  password?: string
  vars?: any
  hasEnvVar?: boolean

  get scenarioPasswordFile() {
    if (!this.file) throw new TraceError('Scenario file is null')
    const name = basename(this.file)
    return join(dirname(this.file), name.substring(0, name.indexOf('.')))
  }

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

    if (vars || this.vars) {
      if (vars) {
        VariableManager.Instance.init(vars)
        this.hasEnvVar = true
      }
      steps?.splice(0, 0, {
        Vars: merge({}, vars || {}, this.vars || {})
      })
    }
    // Load extensions
    if (extensions) await ExtensionManager.Instance.registerGlobalExtension(extensions)
    if (install) await ExtensionManager.Instance.install(install)
    const { file: _file, vars: _vars, hasEnvVar: _hasEnvVar, ...props } = this
    super.init(merge({}, {
      title,
      description,
      logLevel,
      steps,
    }, props))
    return super.prepare()
  }

  async getScenarioFile() {
    if (typeof this.file !== 'string') throw new TraceError('Scenario must be a path of file')

    const existed = FileUtils.Existed(this.file)
    if (!existed) throw new TraceError(`Scenario file is not existed at "${this.file}"`)

    const resource = new Resource(this.file)
    const reader = new Password(resource, this.getPassword(this.password))
    const fileContent = await reader.read()
    let scenarioObject = load(fileContent, {
      schema: YAMLSchema.Schema
    }) as any

    if (Array.isArray(scenarioObject)) {
      scenarioObject = { title: basename(this.file), steps: scenarioObject.flat() }
    }
    if (typeof scenarioObject !== 'object') throw new TraceError('Scenario must be an object or array', { scenarioObject })

    const { password: pwd, ...scenarioProps } = scenarioObject
    if (!scenarioProps) throw new TraceError('File scenario is not valid', { scenarioObject })

    if (pwd && resource.isFile) {
      this.password = this.getPassword(pwd)
      const writer = new Password(new File(this.scenarioPasswordFile), this.password)
      await writer.write(fileContent.toString().replace(/^password:.+$/m, ''))
    }

    return scenarioProps
  }

  clean() {
    this.password && FileUtils.RemoveFilesDirs(this.scenarioPasswordFile)
  }

  private getPassword(password?: string) {
    return password && MD5.Instance.encrypt(`${SALTED_PASSWORD}${password}`)
  }

}