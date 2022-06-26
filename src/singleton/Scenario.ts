import { CLI } from '@app/cli/CLI'
import { ElementFactory } from '@app/elements/ElementFactory'
import { ElementProxy } from '@app/elements/ElementProxy'
import Fragment from '@app/elements/Fragment'
import { Simulator } from '@app/Simulator'
import { LoggerManager, LogLevel } from '@app/singleton/LoggerManager'
import { VariableManager } from '@app/singleton/VariableManager'
import { FileUtils } from '@app/utils/FileUtils'
import { EventEmitter } from "events"
import { homedir } from 'os'
import { basename, dirname, isAbsolute, join, resolve } from 'path'
import { ExtensionManager } from './ExtensionManager'
import { ScenarioEvent } from './ScenarioEvent'
import { ScenarioMonitor } from './ScenarioMonitor'

export class Scenario extends Fragment {
  private static _Instance: ElementProxy<Scenario>
  static get Instance() {
    if (!this._Instance) {
      this._Instance = ElementFactory.CreateTheElement<Scenario>(Scenario)
    }
    return this._Instance
  }

  static Reset() {
    this._Instance?.events.emit(ScenarioEvent.RESET)
    // this._Instance?.events.removeAllListeners()
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
    if (!Simulator.IS_RUNNING) {
      const monitorMonitor = new ScenarioMonitor(this)
      monitorMonitor.monitor()
    }

    this.events.emit(ScenarioEvent.INIT, { time: Date.now() })
    super.init(props)

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
    this.events.emit(ScenarioEvent.PREPARE, { time: Date.now() })
    await super.prepare()
    if (!this.title) this.title = basename(this.file)
    LoggerManager.SetDefaultLoggerLevel(this.logLevel)
  }

  override async exec() {
    this.events.emit(ScenarioEvent.EXEC, { time: Date.now() })
    await super.exec()

    this.isPassed = true
  }

  override async dispose() {
    this.events.emit(ScenarioEvent.DISPOSE, { time: Date.now(), isPassed: this.isPassed })
    await super.dispose()
    this.events.emit(ScenarioEvent.END, { time: Date.now(), isPassed: this.isPassed })
    // this.events.removeAllListeners()
  }

  async clean() {
    await super.clean()
    await ExtensionManager.Instance.uninstall()
  }

  resolvePath(path?: string) {
    if (!path || /^https?:\/\//.test(path)) return path || ''
    if (path.startsWith('~/')) return path.replace(/^\~/, homedir())
    if (path.startsWith('#/')) return path.replace(/^\#/, join(__dirname, '..'))
    if (!isAbsolute(path)) return join(this.rootDir, path)
    return resolve(path)
  }

}