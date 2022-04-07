import { Logger, LoggerManager, LogLevel } from "@app/singleton/LoggerManager";
import { Scenario } from "@app/singleton/Scenario";
import { TemplateManager } from "@app/singleton/TemplateManager";
import { VariableManager } from "@app/singleton/VariableManager";
import { TraceError } from "@app/utils/error/TraceError";
import { TimeUtils } from "@app/utils/TimeUtils";
import cloneDeep from "lodash.clonedeep";
import merge from "lodash.merge";
import omit from "lodash.omit";
import { IElement } from "./IElement";

/** 
 * @guide
 * @name Default attributes
 * @description Attributes in all of elements
 * @group Attribute
 * @order 0
 * @h1 #
 * @end
 */

/** 
 * @guide
 * @name if
 * @description Check condition before decided to run this element or not
 * @group Attribute
 * @h1 ##
 * @example
- Vars:
    isEnd: true

- Echo: 
    if: ${sayHello}
    title: Hello

- Pause:
    if: ${sayHello}
    time: 1s
    title: Delay 1s before say goodbye after say hello

- Echo: 
    if: ${!sayHello}
    title: Goodbye
 * @end
 */

/**
 * @guide
 * @name async
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
 * @end
 */

/**
 * @guide
 * @name delay
 * @description Delay after a specific time before keep playing the nexts
 * @group Attribute
 * @h1 ##
 * @example
- Group:
    title: Delay all of steps in a group
    stepDelay: 1s
    steps:
      - Script/Js: |
          $.proxy.vars.begin = Date.now()   # `$` is referenced to `Js` element in `Script`
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
 * @end
 */

/**
 * @guide
 * @name loop
 * @description Loop element in Array, Object or any conditional
 * @group Attribute
 * @h1 ##
 * @example
# Loop in array
- Vars:
    i: 0
    arr: [1, 2, 3, 4, 5]
    obj:
      name: name 1
      age: 123

- Echo: Init

- Group:
    title: Loop each of items in an array
    loop: ${arr}
    steps:
      - Echo: key is ${$$.loopKey}
      - Echo: value is ${$$.loopValue}

- Group:
    title: Loop each of props in an object
    loop: ${obj}
    steps:
      - Echo: key is ${$$.loopKey}
      - Echo: value is ${$$.loopValue}

- Group:
    title: Loop with specific condition ${i}
    loop: ${i < 10}
    steps:
      - Echo: ${i++}
      - Vars:
          i: ${i+1}
 * @end
 */
export class ElementProxy<T extends IElement> {

  get logger(): Logger {
    return (this.element.logLevel ? LoggerManager.GetLogger(this.element.logLevel) : this.element.$$?.proxy.logger) || LoggerManager.GetLogger()
  }

  get vars() {
    return VariableManager.Instance.vars
  }

  get events() {
    return Scenario.Instance.element.events
  }

  get loopKey() {
    return this.element?.loopKey
  }

  get loopValue() {
    return this.element?.loopValue
  }

  get if() {
    return this.element?.if
  }

  constructor(public element: T) {
    this.element.$ = this.element
    this.element.proxy = this
  }

  get isAttacted() {
    return !!this.element.$$
  }

  init(props: any) {
    const exposeKeys = props && props['->']
    props = this.inherit(props)
    try {
      if (this.element.init) {
        return this.element.init(props)
      }
    } finally {
      this.expose(exposeKeys)
    }
  }

  async prepare() {
    const _if = await this.getVar(this.element.if)
    this.element.if = _if === undefined || _if
    if (!this.element.if) return

    this.element.logLevel = await this.getVar(this.element.logLevel)
    this.element.async = await this.getVar(this.element.async)
    this.element.delay = await this.getVar(this.element.delay)
    if (this.element.prepare && this.element.loop === undefined) {
      await this.element.prepare()
    }
  }

  setGroup(group: IElement) {
    this.element.$$ = group
  }

  async exec() {
    await this.prepare()
    if (!this.element.if) return

    if (this.element.loop === undefined) {
      if (this.element.delay) {
        await TimeUtils.Delay(this.element.delay)
      }
      if (this.element.exec) {
        return this.element.exec()
      }
    } else {
      let loop = await this.getVar(this.element.loop)
      switch (typeof loop) {
        case 'object':
          for (const key in loop) {
            const tmp = this.clone()
            tmp.element.loop = undefined
            tmp.element.loopKey = key
            tmp.element.loopValue = loop[key]
            // if (tmp.element instanceof Group) {
            //   tmp.element.updateChildGroup(tmp)
            // }
            await tmp.exec()
            await tmp.dispose()
          }
          return
        case 'boolean':
          while (loop) {
            const tmp = this.clone()
            tmp.element.loop = undefined
            // tmp.parent = this.proxy.parent
            await tmp.exec()
            await tmp.dispose()
            loop = await this.getVar(this.element.loop)
          }
          return
        default:
          throw new TraceError('Loop is not valid', { loop: this.element.loop, loopValue: loop })
      }
    }
  }

  dispose() {
    if (!this.element.if) return
    if (this.element.dispose) {
      return this.element.dispose()
    }
  }

  clone() {
    let proxy: ElementProxy<T>
    if (this.element.clone) {
      proxy = new ElementProxy<T>(this.element.clone())
    } else {
      // const { proxy: _, ...element } = this.element
      const oldProxy = this.element['proxy']
      this.element['proxy'] = undefined
      proxy = new ElementProxy<T>(cloneDeep(this.element) as T)
      this.element.proxy = oldProxy
    }
    return proxy
  }

  resolvePath(path?: string) {
    return Scenario.Instance.element.resolvePath(path)
  }

  changeLogLevel(level: LogLevel) {
    this.element.logLevel = level
  }

  async replaceVar(varObj: any, obj = {} as any, defaultKey?: string) {
    if (typeof varObj === 'object') {
      await VariableManager.Instance.replace(varObj, { $: this.element.$ || this.element, $$: this.element.$$, ...obj }, defaultKey)
    }
  }

  async setVar(varObj: any, obj = {} as any, defaultKey?: string) {
    if (typeof varObj === 'string') {
      await VariableManager.Instance.set(varObj, obj, defaultKey)
    } else {
      await VariableManager.Instance.set(varObj, { $: this.element.$ || this.element, $$: this.element.$$, ...obj }, defaultKey)
    }
  }

  async eval<T>(func?: string, baseContext = {} as any) {
    const vl = await VariableManager.Instance.eval(func, { $: this.element.$ || this.element, $$: this.element.$$, ...baseContext })
    return vl as T
  }

  async getVar(obj: any, baseContext = {}) {
    const vl = await VariableManager.Instance.get(obj, { $: this.element.$ || this.element, $$: this.element.$$, ...baseContext })
    return vl
  }

  async applyVars(obj: any, ...props: string[]) {
    await Promise.all(props.map(async p => obj[p] = await this.getVar(obj[p])))
  }

  inherit(props: any) {
    if (props && props['<-']) {
      const keys = Array.isArray(props['<-']) ? props['<-'] : [props['<-']]
      keys.forEach(key => {
        const temp = TemplateManager.Instance.getElement(key)
        const prop = merge({}, temp, props)
        merge(props, prop)
      })
      delete props['<-']
    }
    return props
  }

  expose(exposeKeys: string[] | string) {
    if (exposeKeys) {
      const keys = Array.isArray(exposeKeys) ? exposeKeys : [exposeKeys]
      keys.forEach(key => {
        TemplateManager.Instance.setElement(key, omit(this.element, '->'))
      })
      delete this.element['->']
    }
  }

}