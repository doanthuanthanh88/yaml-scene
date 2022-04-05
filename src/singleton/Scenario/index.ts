import Fragment from '@app/elements/Fragment'
import { LoggerManager } from '@app/singleton/LoggerManager'
import { VariableManager } from '@app/singleton/VariableManager'
import { FileUtils } from '@app/utils/FileUtils'
import { homedir } from 'os'
import { dirname, isAbsolute, join, resolve } from 'path'
import { EventEmitter } from 'stream'
import { ElementFactory } from '../../elements/ElementFactory'
import { ElementProxy } from '../../elements/ElementProxy'
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
steps:                                              # Includes all which you want to do (URL or file local)
  - Fragment ./scene1.yas.yaml
  - Fragment ./scene2.yas.yaml
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
- Fragment ./scene1.yas.yaml                        # Includes all which you want to do (URL or file local)
- Fragment ./scene2.yas.yaml
 * @end
 */

export class Scenario {
  private static _Instance: Scenario | null
  static get Instance() {
    if (this._Instance) return this._Instance
    this._Instance = new Scenario()
    return this._Instance
  }

  events: EventEmitter
  isPassed: boolean = false
  scenarioFile?: string
  rootDir: string
  private rootGroup?: ElementProxy<Fragment>
  get hasEnvVar() {
    return this.rootGroup?.element.hasEnvVar
  }

  get scenarioPasswordFile() {
    return this.rootGroup?.element.scenarioPasswordFile
  }

  get password() {
    return this.rootGroup?.element.password
  }

  get title() {
    return this.rootGroup?.element.title
  }
  get description() {
    return this.rootGroup?.element.description
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

  async init(scenarioFile = 'index.yas.yaml', password?: string) {
    this.events.emit('scenario.init', { time: Date.now() })

    this.scenarioFile = this.resolvePath(scenarioFile)

    const existed = FileUtils.Existed(this.scenarioFile)
    if (existed === true) {
      this.rootDir = dirname(this.scenarioFile)
    }

    this.rootGroup = ElementFactory.CreateElement<Fragment>('Fragment')
    this.rootGroup?.init({
      file: this.scenarioFile,
      password,
    })

    LoggerManager.SetDefaultLoggerLevel(this.rootGroup?.element.logLevel)

  }

  async prepare() {
    this.events.emit('scenario.prepare', { time: Date.now() })
    await this.rootGroup?.prepare()
  }

  async exec() {
    this.events.emit('scenario.exec', { time: Date.now() })
    await this.rootGroup?.exec()
    this.isPassed = true
  }

  async clean() {
    this.rootGroup?.element.clean()
    await ExtensionManager.Instance.uninstall()
  }

  async dispose() {
    this.events.emit('scenario.dispose', { time: Date.now(), isPassed: this.isPassed })
    await this.rootGroup?.dispose()
    this.events.emit('scenario.end', { time: Date.now(), isPassed: this.isPassed })
  }

  resolvePath(path?: string) {
    if (!path || /^https?:\/\//.test(path)) return path || ''
    if (path.startsWith('~/')) return path.replace(/^\~/, homedir())
    if (!isAbsolute(path)) return join(this.rootDir, path)
    return resolve(path)
  }

}