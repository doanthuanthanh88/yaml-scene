import { LoggerFactory } from '@app/utils/logger'
import { safeLoad } from 'js-yaml'
import { homedir } from 'os'
import { basename, dirname, extname, join, resolve } from 'path'
import { EventEmitter } from 'stream'
import { ElementFactory } from '../elements/ElementFactory'
import { ElementProxy } from '../elements/ElementProxy'
import { Group } from '../elements/Group'
import { SCHEMA } from '../tags'
import { Extensions } from '../utils/extensions'
import { VarManager } from './VarManager'

/**
 * Standard Scenario file
 * @h1
 * @order 1
 * @description A standard scenario file
 * @example
title: Scene name                 # Scene name
description: Scene description    # Scene description
password:                         # File will be encrypted to $FILE_NAME.encrypt to share to someone run it for privacy
logLevel: debug                   # How to show log is debug)
                                  # - slient: Dont show anything
                                  # - error: Show error log
                                  # - warn: Show warning log
                                  # - info: Show infor, error log
                                  # - debug: Show log details, infor, error log ( Default )
                                  # - trace: Show all of log
extensions:                       # Extension elements
  - ~/code/github/yaml-scene/yaml-test/extensions/custom.js
vars:                             # Declare global variables, which can be replaced by env
  url: http://localhost:3000
  token: ...
steps:                            # Includes all which you want to do
  - !fragment ./scene1.yaml
  - !fragment ./scene2.yaml
 */

/**
 * Simple Scenario file
 * @h1
 * @order 2
 * @description A simple scenario file
 * @example
- !fragment ./scene1.yaml
- !fragment ./scene2.yaml
 */

export class Scenario {
  private static _Instance: Scenario
  private static readonly SALTED_PASSWORD = '|-YAML-SCENE-|'

  static get Current(): Scenario | never {
    return Scenario._Instance || (Scenario._Instance = new Scenario())
  }

  events: EventEmitter
  title?: string
  description?: string
  password?: string

  private rootDir: string
  private rootGroup: ElementProxy<Group>
  time: {
    begin: number
    init: number,
    prepare: number,
    exec: number,
    dispose: number
    end: number
  }
  hasEnvVar: boolean

  constructor() {
    this.events = new EventEmitter()
    this.time = {
      begin: Date.now()
    } as any
  }

  async init(scenarioFile = 'index.yaml' as string | object, password?: string) {
    this.time.init = Date.now()
    this.events.emit('scenario.init')

    this.rootGroup = ElementFactory.CreateElement<Group>('Group')

    let scenario: any

    if (typeof scenarioFile !== 'string') throw new Error('Scenario must be a path of file')
    scenarioFile = resolve(scenarioFile)
    this.rootDir = dirname(scenarioFile)
    const fileContent = await this.getScenarioFileContent(scenarioFile, this.getPassword(password))
    scenario = safeLoad(fileContent, {
      schema: SCHEMA
    }) as any
    if (Array.isArray(scenario)) {
      scenario = { title: basename(scenarioFile), steps: scenario.flat() }
    }

    const { password: pwd, extensions, vars, logLevel = 'info', ...scenarioProps } = scenario
    if (!scenarioProps) throw new Error('File scenario is not valid')

    this.title = scenarioProps.title
    this.description = scenarioProps.description

    if (pwd && extname(scenarioFile)) {
      this.password = this.getPassword(pwd)
      await this.saveToEncryptFile(fileContent, this.password, join(dirname(scenarioFile), basename(scenarioFile).split('.')[0]))
    }

    if (logLevel) {
      if (logLevel === 'slient') {
        LoggerFactory.GetLogger().disableAll()
      } else {
        LoggerFactory.GetLogger().setDefaultLevel(logLevel)
      }
    }

    // Load extensions
    await Extensions.Setup(extensions && (Array.isArray(extensions) ? extensions : [extensions]))

    // Load global variables which is overrided by env variables
    if (vars) {
      VarManager.Instance.set(vars, null)
      this.hasEnvVar = true
    }
    // Load Scenario
    if (Array.isArray(scenarioProps)) {
      this.rootGroup.init({ steps: scenarioProps, title: this.title, description: this.description })
    } else {
      this.rootGroup.init(scenarioProps)
    }
  }

  async prepare() {
    this.time.prepare = Date.now()
    this.events.emit('scenario.prepare')
    await this.rootGroup.prepare()
  }

  async exec() {
    this.time.exec = Date.now()
    this.events.emit('scenario.exec')
    await this.rootGroup.exec()
  }

  async dispose() {
    this.time.dispose = Date.now()
    this.events.emit('scenario.dispose')
    await this.rootGroup.dispose()
  }

  resolvePath(path: string) {
    if (!path) return path
    return path.startsWith('~/') ? path.replace(/^\~/, homedir()) : path.startsWith('/') ? resolve(path) : join(this.rootDir, path)
  }

  printLog() {
    this.time.end = Date.now()
    console.group('Time summary')
    console.log('- Initting', this.time.prepare - this.time.init, 'ms')
    console.log('- Preparing', this.time.exec - this.time.prepare, 'ms')
    console.log('- Executing', this.time.dispose - this.time.exec, 'ms')
    console.log('- Dispose', this.time.end - this.time.dispose, 'ms')
    console.groupEnd()
  }

  private getPassword(password: string) {
    return password && `${Scenario.SALTED_PASSWORD}${password}`
  }

  private async getScenarioFileContent(scenarioFile: string, password: string) {
    const rf = ElementFactory.CreateElement('ReadFile')
    await rf.element.init({
      path: scenarioFile,
      type: 'text',
      decrypt: {
        password
      }
    })
    const fileContent = await rf.element.exec()
    await rf.dispose()
    return fileContent
  }

  private async saveToEncryptFile(content: string, password: string, fileOut: string) {
    const rf = ElementFactory.CreateElement('WriteFile')
    await rf.element.init({
      content,
      path: fileOut,
      type: 'text',
      encrypt: {
        password
      }
    })
    await rf.exec()
    await rf.dispose()
  }
}