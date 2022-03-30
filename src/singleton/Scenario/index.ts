import { Buf } from '@app/elements/File/adapter/Buf'
import { File } from '@app/elements/File/adapter/File'
import { IFileAdapter } from '@app/elements/File/adapter/IFileAdapter'
import { Password } from '@app/elements/File/adapter/Password'
import { Text } from '@app/elements/File/adapter/Text'
import { LoggerManager } from '@app/singleton/LoggerManager'
import { VariableManager } from '@app/singleton/VariableManager'
import { MD5 } from '@app/utils/encrypt/MD5'
import { TraceError } from '@app/utils/error/TraceError'
import { FileUtils, UrlPathType } from '@app/utils/FileUtils'
import { rmSync } from 'fs'
import { load } from 'js-yaml'
import { homedir } from 'os'
import { basename, dirname, isAbsolute, join, resolve } from 'path'
import { EventEmitter } from 'stream'
import { ElementFactory } from '../../elements/ElementFactory'
import { ElementProxy } from '../../elements/ElementProxy'
import Group from '../../elements/Group'
import { YAMLSchema } from '../../tags'
import { ExtensionManager } from '../ExtensionManager'
import { TemplateManager } from '../TemplateManager'

/**
 * @guide
 * @name Standard Scenario file
 * @h1
 * @order 1
 * @description A standard scenario file
 * @example
title: Scene name                                   # Scene name
description: Scene description                      # Scene description
password:                                           # File will be encrypted to $FILE_NAME.encrypt to share to someone run it for privacy
logLevel: debug                                     # How to show log is debug)
                                                    # - slient: Dont show anything
                                                    # - error: Show error log
                                                    # - warn: Show warning log
                                                    # - info: Show infor, error log
                                                    # - debug: Show log details, infor, error log ( Default )
                                                    # - trace: Show all of log
install:                                            # Install extensions from npm registry
  global: false                                     # Install extension to global (npm install -g)
  localPath: ./                                     # Install extensions to local path (npm install --prefix $localPath/node_modules)
  dependencies:
    - lodash
    - axios
extensions:                                         # Extension elements.
  extension_name1: ./cuz_extensions/custom1.js      # - Load a element in a file with exports.default (extension_name1:)
  extensions_folders: ./cuz_extensions              # - Load elements in files in the folder with file name is element name (extensions_folders/custom1:)
vars:                                               # Declare global variables, which can be replaced by env
  url: http://localhost:3000                        # env URL=
  token: ...                                        # env TOKEN=
  user:
    id_test: 1                                      # env USER_ID_TEST=
stepDelay: 1s                                       # Each of steps will delay 1s before play the next
steps:                                              # Includes all which you want to do
  - !fragment ./scene1.yas.yaml
  - !fragment ./scene2.yas.yaml
  - extension_name1:
  - extensions_folders/custom1:
  - Script/Js: |
      require('lodash').merge({}, {})
  - yas-sequence-diagram~SequenceDiagram:           # Load yas-sequence-diagram from npm/yarn global dirs then use class SequenceDiagram to handle
 * @end
 */

/**
 * @guide
 * @name Simple Scenario file
 * @h1
 * @order 2
 * @description A simple scenario file
 * @example
- !fragment ./scene1.yas.yaml
- !fragment ./scene2.yas.yaml
 * @end
 */

export class Scenario {
  private static readonly SALTED_PASSWORD = '|-YAML-SCENE-|'
  private static _Instance: Scenario
  static get Instance() {
    if (this._Instance) return this._Instance
    this._Instance = new Scenario()
    return this._Instance
  }

  events: EventEmitter

  password?: string
  isRunningRemote?: boolean
  isPassed: boolean

  scenarioFile: string
  rootDir: string
  hasEnvVar: boolean
  private rootGroup: ElementProxy<Group>

  get scenarioPasswordFile() {
    const name = basename(this.scenarioFile)
    return join(dirname(this.scenarioFile), name.substring(0, name.indexOf('.')))
  }

  get title() {
    return this.rootGroup.element.title
  }
  get description() {
    return this.rootGroup.element.description
  }

  constructor() {
    this.rootDir = process.cwd()
    this.events = new EventEmitter()
  }

  reset() {
    Scenario._Instance = null
    ExtensionManager.Instance?.reset()
    TemplateManager.Instance?.reset()
    VariableManager.Instance?.reset()
  }

  async init(scenarioFile = 'index.yas.yaml' as string | object, password?: string) {
    const scenarioObject = await this.getScenarioFile(scenarioFile, password)

    const { extensions, install, vars, logLevel, ...scenarioProps } = scenarioObject
    if (!scenarioProps) throw new TraceError('File scenario is not valid', { scenarioFile, scenarioObject })

    LoggerManager.SetDefaultLoggerLevel(logLevel)

    // Load extensions
    if (extensions) await ExtensionManager.Instance.registerGlobalExtension(extensions)
    if (install) await ExtensionManager.Instance.install(install)

    // Load global variables which is overrided by env variables
    if (vars) {
      VariableManager.Instance.init(vars)
      this.hasEnvVar = true
    }
    // Load Scenario
    this.rootGroup = ElementFactory.CreateElement<Group>('Group')
    this.rootGroup.init(scenarioProps)
  }

  async prepare() {
    this.events.emit('scenario.prepare', { time: Date.now() })
    await this.rootGroup.prepare()
  }

  async exec() {
    this.events.emit('scenario.exec', { time: Date.now() })
    await this.rootGroup.exec()
    this.isPassed = true
  }

  async clean() {
    this.password && rmSync(this.scenarioPasswordFile, { force: true })
    await ExtensionManager.Instance.uninstall()
  }

  dispose() {
    this.events.emit('scenario.dispose', { time: Date.now(), isPassed: this.isPassed })
    return this.rootGroup?.dispose()
  }

  resolvePath(path: string) {
    if (!path || /^https?:\/\//.test(path)) return path
    if (path.startsWith('~/')) return path.replace(/^\~/, homedir())
    if (!isAbsolute(path)) return join(this.rootDir, path)
    return resolve(path)
  }

  private async getScenarioFile(scenarioFile: string | object, password: string) {
    if (typeof scenarioFile !== 'string') throw new TraceError('Scenario must be a path of file')

    this.events.emit('scenario.init', { time: Date.now() })

    let fileContent: any
    this.isRunningRemote = FileUtils.GetPathType(scenarioFile) === UrlPathType.URL
    if (this.isRunningRemote) {
      this.scenarioFile = scenarioFile
      const fileBufContent = await FileUtils.GetContentFromUrlOrPath(this.scenarioFile)
      fileContent = await this.getScenarioFileContent(this.getPassword(password), new Buf(fileBufContent))
    } else {
      this.scenarioFile = resolve(scenarioFile)
      this.rootDir = dirname(this.scenarioFile)
      fileContent = await this.getScenarioFileContent(this.getPassword(password), new File(this.scenarioFile))
    }
    let scenarioObject = load(fileContent, {
      schema: YAMLSchema.Schema
    }) as any

    if (Array.isArray(scenarioObject)) {
      scenarioObject = { title: basename(this.scenarioFile), steps: scenarioObject.flat() }
    }
    if (typeof scenarioObject !== 'object') throw new TraceError('Scenario must be an object or array', { scenarioObject })

    const { password: pwd, ...scenarioProps } = scenarioObject
    if (!scenarioProps) throw new TraceError('File scenario is not valid', { scenarioObject })

    if (pwd && !this.isRunningRemote) {
      this.password = this.getPassword(pwd)
      await this.saveToEncryptFile(fileContent.replace(/^password:.+$/m, ''), this.password, this.scenarioPasswordFile)
    }

    return scenarioProps
  }

  private getPassword(password: string) {
    return password && MD5.Instance.encrypt(`${Scenario.SALTED_PASSWORD}${password}`)
  }

  private async getScenarioFileContent(password: string, filedapter: IFileAdapter) {
    let reader: IFileAdapter = new Text(filedapter)
    if (password) {
      reader = new Password(reader, password)
    }
    const fileContent = await reader.read()
    return fileContent
  }

  private async saveToEncryptFile(content: string, password: string, fileOut: string) {
    let writer: IFileAdapter = new Text(new File(fileOut))
    if (password) {
      writer = new Password(writer, password)
    }
    await writer.write(content)
  }
}