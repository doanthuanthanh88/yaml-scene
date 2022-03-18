import { Scenario } from "@app/singleton/Scenario";
import { TimeUtils } from "@app/utils/time";
import merge from "lodash.merge";
import cloneDeep from "lodash.clonedeep";
import { IElement } from "./IElement";

/**
 * Default attributes
 * @description Attributes in all of elements
 * @group Attribute
 * @order 0
 * @h1 #
 */

/**
 * if
 * @description Check condition before decided to run this element or not
 * @group Attribute
 * @h1 ##
 * @example
- Vars:
    isEnd: true

- Echo: 
    if: ${sayHello}
    title: Hello

- Sleep:
    if: ${sayHello}
    title: Sleep before say goodbye after say hello

- Echo: 
    if: ${!sayHello}
    title: Goodbye
 */

/**
 * async
 * @description Run element asynchronized which not blocked others
 * @group Attribute
 * @h1 ##
 * @example
- Group:
    title: Run async jobs
    stepDelay: 2s
    steps:
      - Group:
          async: true
          steps:
            - Echo: Hello 1
      - Group:
          async: true
          steps:
            - Echo: Hello 2
      - Group:
          async: true
          steps:
            - Echo: Hello 3
 */

/**
 * delay
 * @description Delay after a specific time before keep playing the nexts
 * @group Attribute
 * @h1 ##
 * @example
- Group:
    title: Delay all of steps in a group
    stepDelay: 1s
    steps:
      - Script/Js: |
          _.proxy.setVar('begin', Date.now())
      - Echo: ${Date.now() - begin}
      - Echo: ${Date.now() - begin}

- Group:
    title: Pause or delay
    steps:
      - Echo: <step 1>
      - Pause:
          title: step 2 run after 2s
          time: 2s
      - Echo: <step 2>
 */
export class ElementProxy<T extends IElement> {
  _: any
  __: any
  private _logLevel: string
  if?: any
  delay?: any
  async?: any

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
    if (props?.ref) {
      this.scenario.variableManager.vars[props.ref] = this.element
    }
    if (props?.logLevel) this._logLevel = props.logLevel
    if (props?.if) this.if = props.if
    if (props?.async) this.async = props.async
    if (props?.delay) this.delay = props.delay
    if (this.element.init) {
      return this.element.init(props)
    }
  }

  async prepare() {
    if (this.element.prepare) {
      await this.element.prepare()
    }
    this._logLevel = this.getVar(this.logLevel)
    this.delay = this.getVar(this.delay)
    this.async = this.getVar(this.async)
  }

  async isValid() {
    let isOk = true
    if (this.if !== undefined) {
      if (typeof this.if === 'string') {
        isOk = this.getVar(this.if)
      } else {
        isOk = this.if
      }
    }
    return isOk
  }

  async exec() {
    if (this.delay) {
      await TimeUtils.Delay(this.delay)
    }
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