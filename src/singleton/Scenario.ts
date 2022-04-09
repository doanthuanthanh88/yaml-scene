import { CLI } from '@app/cli/CLI'
import { ElementFactory } from '@app/elements/ElementFactory'
import { ElementProxy } from '@app/elements/ElementProxy'
import Fragment from '@app/elements/Fragment'
import { Simulator } from '@app/Simulator'
import { LoggerManager, LogLevel } from '@app/singleton/LoggerManager'
import { VariableManager } from '@app/singleton/VariableManager'
import { FileUtils } from '@app/utils/FileUtils'
import { TimeUtils } from '@app/utils/TimeUtils'
import chalk from 'chalk'
import { EventEmitter } from "events"
import { homedir } from 'os'
import { basename, dirname, isAbsolute, join, resolve } from 'path'
import { ExtensionManager } from './ExtensionManager'

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

export class Scenario extends Fragment {
  private static _Instance: ElementProxy<Scenario>
  static get Instance() {
    if (!this._Instance) {
      this._Instance = ElementFactory.CreateTheElement<Scenario>(Scenario)
    }
    return this._Instance
  }

  static Reset() {
    this._Instance?.events.emit('scenario.reset')
    this._Instance = undefined
  }

  events: EventEmitter
  isPassed: boolean = false
  rootDir: string

  constructor() {
    super()
    this.rootDir = process.cwd()
    this.events = new EventEmitter()
  }

  override async init(props: { file: string, password?: string, logLevel?: LogLevel }) {
    if (!Simulator.IS_RUNNING) this.monitor()

    super.init(props)
    this.events.emit('scenario.init', { time: Date.now() })

    this.file = this.resolvePath(this.file)

    const existed = FileUtils.Existed(this.file)
    if (existed === true) {
      this.rootDir = dirname(this.file)
    }
  }

  override async declareAndInit(vars: any) {
    VariableManager.Instance.declare(vars)
    CLI.Instance.loadEnv(VariableManager.Instance.vars, this.proxy.resolvePath(CLI.Instance.envFile), process.env, CLI.Instance.env)
    await this.proxy.setVar(VariableManager.Instance.vars)
  }

  override async prepare() {
    this.events.emit('scenario.prepare', { time: Date.now() })
    await super.prepare()
    if (!this.title) this.title = basename(this.file)
    LoggerManager.SetDefaultLoggerLevel(this.logLevel)
  }

  override async exec() {
    this.events.emit('scenario.exec', { time: Date.now() })
    await super.exec()

    this.isPassed = true
  }

  override async dispose() {
    this.events.emit('scenario.dispose', { time: Date.now(), isPassed: this.isPassed })
    await super.dispose()
    this.events.emit('scenario.end', { time: Date.now(), isPassed: this.isPassed })
    // this.events.removeAllListeners()
  }

  async clean() {
    await super.clean()
    await ExtensionManager.Instance.uninstall()
  }

  resolvePath(path?: string) {
    if (!path || /^https?:\/\//.test(path)) return path || ''
    if (path.startsWith('~/')) return path.replace(/^\~/, homedir())
    if (!isAbsolute(path)) return join(this.rootDir, path)
    return resolve(path)
  }

  private monitor() {
    const executeTime = {
      init: 0,
      prepare: 0,
      exec: 0,
      dispose: 0
    }
    this.events
      .on('scenario.init', ({ time }) => {
        executeTime.init = time
      })
      .on('scenario.prepare', ({ time }) => {
        executeTime.prepare = time
      })
      .on('scenario.exec', ({ time }) => {
        executeTime.exec = time
      })
      .on('scenario.dispose', ({ time }) => {
        executeTime.dispose = time
      })
      .on('scenario.end', ({ time, isPassed }) => {
        if (isPassed) {
          const msg = []
          msg.push('\n')
          msg.push(chalk.bgBlue.white(` Total ${TimeUtils.Pretty(time - executeTime.init)} `))
          msg.push(chalk.bgCyan.white(` `))
          msg.push(chalk.bgWhite.gray(` Init ${TimeUtils.Pretty(executeTime.prepare - executeTime.init)} `))
          msg.push(chalk.bgYellow.gray(` Prepare ${TimeUtils.Pretty(executeTime.exec - executeTime.prepare)} `))
          msg.push(chalk.bgGreen.white(` Execute ${TimeUtils.Pretty(executeTime.dispose - executeTime.exec)} `))
          msg.push(chalk.bgGray.white(` Dispose ${TimeUtils.Pretty(time - executeTime.dispose)} `))
          msg.push('\n')
          LoggerManager.GetLogger().info(msg.join(''))
        }
      })
  }

}