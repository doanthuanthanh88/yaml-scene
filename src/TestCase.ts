import { join, resolve } from 'path'
import { EventEmitter } from 'stream'
import { ElementFactory } from './elements/ElementFactory'
import { ElementProxy } from './elements/ElementProxy'
import { Group } from './elements/Group'
import { VarManager } from './singleton/VarManager'

export class TestCase {
  static RootDir: string
  rootGroup: ElementProxy<Group>
  events: EventEmitter
  testcaseProps: any
  vars: any
  time: {
    begin: number
    init: number,
    prepare: number,
    exec: number,
    dispose: number
    end: number
  }

  static GetPathFromRoot(str: string) {
    return str.startsWith('/') ? resolve(str) : join(TestCase.RootDir, str)
  }

  constructor(testcaseProps: any) {
    this.events = new EventEmitter()
    this.time = {} as any
    this.rootGroup = ElementFactory.CreateElement<Group>('Group', this)
    const { vars, ...props } = testcaseProps
    this.vars = vars
    this.testcaseProps = props
  }

  init() {
    this.time.init = Date.now()
    this.events.emit('TestCase.init')
    if (this.vars) {
      VarManager.Instance.set(this.vars, null)
    }
    if (Array.isArray(this.testcaseProps)) {
      this.rootGroup.init({ steps: this.testcaseProps })
    } else {
      this.rootGroup.init(this.testcaseProps)
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
}