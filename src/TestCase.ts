import { readFileSync } from 'fs'
import { safeLoad } from 'js-yaml'
import { basename, dirname, join, resolve } from 'path'
import { EventEmitter } from 'stream'
import { ElementFactory } from './elements/ElementFactory'
import { ElementProxy } from './elements/ElementProxy'
import { Group } from './elements/Group'
import { VarManager } from './singleton/VarManager'
import { SCHEMA } from './tags'
import { ExternalLibs } from './utils/external-libs'

export class TestCase {
  private static _Instance: TestCase

  static get Instance(): TestCase | never {
    return TestCase._Instance || (TestCase._Instance = new TestCase())
  }

  events: EventEmitter

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

  constructor() {
    this.events = new EventEmitter()
    this.time = {} as any
  }

  async init(scenarioFile?: string | object) {
    this.time.init = Date.now()
    this.events.emit('TestCase.init')

    this.rootGroup = ElementFactory.CreateElement<Group>('Group')

    if (!scenarioFile) return

    let scenario: any

    if (typeof scenarioFile === 'string') {
      this.rootDir = resolve(dirname(scenarioFile))
      scenario = safeLoad(readFileSync(scenarioFile).toString(), {
        schema: SCHEMA
      }) as any
      if (Array.isArray(scenario)) {
        scenario = { title: basename(scenarioFile), steps: scenario.flat() }
      }
    }

    const { externalLibs, vars, ...testcaseProps } = scenario
    // Load external librarries
    if (externalLibs) {
      await ExternalLibs.Setup(Array.isArray(externalLibs) ? externalLibs : [externalLibs])
    }
    // Load global variables which is overrided by env variables
    if (vars) {
      VarManager.Instance.set(vars, null)
    }
    // Load testcase
    if (Array.isArray(testcaseProps)) {
      this.rootGroup.init({ steps: testcaseProps })
    } else {
      this.rootGroup.init(testcaseProps)
    }
  }

  async prepare() {
    this.time.prepare = Date.now()
    this.events.emit('TestCase.prepare')
    await this.rootGroup.prepare()
  }

  async exec() {
    this.time.exec = Date.now()
    this.events.emit('TestCase.exec')
    await this.rootGroup.exec()
  }

  async dispose() {
    this.time.dispose = Date.now()
    // this.events.emit('TestCase.dispose')
    await this.rootGroup.dispose()
  }

  resolvePath(path: string) {
    if (!path) return path
    return path.startsWith('/') ? resolve(path) : join(this.rootDir, path)
  }
}