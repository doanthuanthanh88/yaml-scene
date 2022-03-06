import { readFileSync } from 'fs'
import { safeLoad } from 'js-yaml'
import { homedir } from 'os'
import { basename, dirname, join, resolve } from 'path'
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
extensions:                     # Extension elements
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

  static get Current(): Scenario | never {
    return Scenario._Instance || (Scenario._Instance = new Scenario())
  }

  events: EventEmitter
  title?: string
  description?: string

  private rootDir: string
  private rootGroup: ElementProxy<Group>
  private time: {
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

  async init(scenarioFile = 'index.yaml' as string | object) {
    this.time.init = Date.now()
    this.events.emit('Scenario.init')

    this.rootGroup = ElementFactory.CreateElement<Group>('Group')

    let scenario: any

    if (typeof scenarioFile === 'string') {
      scenarioFile = resolve(scenarioFile)
      this.rootDir = dirname(scenarioFile)
      scenario = safeLoad(readFileSync(scenarioFile).toString(), {
        schema: SCHEMA
      }) as any
      if (Array.isArray(scenario)) {
        scenario = { title: basename(scenarioFile), steps: scenario.flat() }
      }
    }

    const { extensions, vars, ...scenarioProps } = scenario

    this.title = scenarioProps.title
    this.description = scenarioProps.description

    // Load extensions
    if (extensions) {
      await Extensions.Setup(Array.isArray(extensions) ? extensions : [extensions])
    }
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
    this.events.emit('Scenario.prepare')
    await this.rootGroup.prepare()
  }

  async exec() {
    this.time.exec = Date.now()
    this.events.emit('Scenario.exec')
    await this.rootGroup.exec()
  }

  async dispose() {
    this.time.dispose = Date.now()
    // this.events.emit('Scenario.dispose')
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
}