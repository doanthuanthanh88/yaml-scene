import { Scenario } from "@app/singleton/Scenario";
import { cloneDeep, merge } from "lodash";
import { IElement } from "./IElement";

export class ElementProxy<T extends IElement> {
  _: any
  __: any
  private _logLevel: string

  get logLevel() {
    return this._logLevel || this._?.logLevel || this.__?.logLevel
  }

  get logger() {
    return this.scenario.loggerFactory.getLogger(this.logLevel)
  }

  constructor(public element: T, public scenario: Scenario) {
    const self = this
    Object.defineProperty(element, 'proxy', {
      get() {
        return self
      }
    })
    this._ = element
    this.__ = element.proxy.__
  }

  init(props: any) {
    if (props?.logLevel) {
      this._logLevel = props.logLevel
    }
    if (this.element.init) {
      return this.element.init(props)
    }
  }

  async prepare() {
    if (this.element.prepare) {
      await this.element.prepare()
    }
  }

  async exec() {
    if (this.element.exec) {
      await this.element.exec()
    }
  }

  async dispose() {
    if (this.element.dispose) {
      await this.element.dispose()
    }
  }

  clone() {
    if (this.element.clone) {
      return new ElementProxy<T>(this.element.clone(), this.scenario)
    }
    return new ElementProxy<T>(cloneDeep(this.element), this.scenario)
  }

  resolvePath(path: string) {
    return this.scenario.resolvePath(path)
  }

  changeLogLevel(level: string) {
    this._logLevel = level
  }

  setVar(varObj: any, obj: any, defaultKey?: string) {
    return this.scenario.variableManager.set(varObj, obj, defaultKey)
  }

  eval(obj: any, baseContext = {} as any) {
    return this.scenario.variableManager.eval(obj, { ...baseContext, _: this._, __: this.__ })
  }

  getVar(obj: any, baseContext = {}) {
    return this.scenario.variableManager.get(obj, { ...baseContext, _: this._, __: this.__ })
  }

  inherit(keys: string[]) {
    if (keys?.length) {
      keys.forEach(key => {
        const temp = this.scenario.templateManager.get(key)
        const prop = merge({}, temp, this.element)
        merge(this.element, prop)
      })
    }
  }

  expose(key?: string) {
    if (key) {
      this.scenario.templateManager.set(key, this.element)
    }
  }

}