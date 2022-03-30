import { LoggerManager } from "@app/singleton/LoggerManager";
import { Scenario } from "@app/singleton/Scenario";
import { TemplateManager } from "@app/singleton/TemplateManager";
import { VariableManager } from "@app/singleton/VariableManager";
import { TimeUtils } from "@app/utils/TimeUtils";
import cloneDeep from "lodash.clonedeep";
import merge from "lodash.merge";
import omit from "lodash.omit";
import Group from "./Group";
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

- Delay:
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
          $.proxy.setVar('begin', Date.now())   # `$` is referenced to `Js` element in `Script`
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

  get logger() {
    return (this.element.logLevel ? LoggerManager.GetLogger(this.element.logLevel) : this.element.$$?.proxy.logger) || LoggerManager.GetLogger()
  }

  constructor(public element: T) {
    this.element.$ = this.element
    this.element.proxy = this
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
    this.element.logLevel = await this.getVar(this.element.logLevel)
    this.element.async = await this.getVar(this.element.async)
    this.element.if = await this.getVar(this.element.if)
    this.element.delay = await this.getVar(this.element.delay)
    if (this.element.prepare) {
      return this.element.prepare()
    }
  }

  async isValid() {
    let isOk = true
    if (this.element.if !== undefined) {
      if (typeof this.element.if === 'string') {
        isOk = await this.getVar(this.element.if)
      } else {
        isOk = this.element.if
      }
    }
    return isOk
  }

  setGroup(group: IElement) {
    this.element.$$ = group
  }

  async exec() {
    if (this.element.loop === undefined) {
      if (this.element.delay) {
        await TimeUtils.Delay(this.element.delay)
      }
      if (this.element.exec) {
        const rs = await this.element.exec()
        return rs
      }
    } else {
      let loop = await this.getVar(this.element.loop)
      if (typeof loop === 'object') {
        for (const key in loop) {
          const tmp = this.clone()
          tmp.element.loop = undefined
          tmp.element.loopKey = key
          tmp.element.loopValue = loop[key]
          // if (tmp.element instanceof Group) {
          //   tmp.element.updateChildGroup(tmp)
          // }
          await tmp.prepare()
          await tmp.exec()
          await tmp.dispose()
        }
      } else {
        while (loop) {
          const tmp = this.clone()
          tmp.element.loop = undefined
          // tmp.parent = this.proxy.parent
          await tmp.prepare()
          await tmp.exec()
          await tmp.dispose()
          loop = await this.getVar(this.element.loop)
        }
      }
    }
  }

  dispose() {
    if (this.element.dispose) {
      return this.element.dispose()
    }
  }

  clone() {
    let proxy: ElementProxy<T>
    const oldProxy = this.element.proxy
    this.element.proxy = undefined
    if (this.element.clone) {
      proxy = new ElementProxy<T>(this.element.clone())
    } else {
      proxy = new ElementProxy<T>(cloneDeep(this.element))
    }
    this.element.proxy = oldProxy
    if (proxy.element instanceof Group) {
      proxy.element.initSteps()
    }
    return proxy
  }

  resolvePath(path: string) {
    return Scenario.Instance.resolvePath(path)
  }

  changeLogLevel(level: string) {
    this.element.logLevel = level
  }

  async setVar(varObj: any, obj = {} as any, defaultKey?: string) {
    if (typeof varObj === 'string') {
      await VariableManager.Instance.set(varObj, obj, defaultKey)
    }
    await VariableManager.Instance.set(varObj, { $: this.element.$ || this.element, $$: this.element.$$, ...obj }, defaultKey)
  }

  eval(obj: any, baseContext = {} as any) {
    return VariableManager.Instance.eval(obj, { $: this.element.$ || this.element, $$: this.element.$$, ...baseContext })
  }

  async getVar(obj: any, baseContext = {}) {
    return await VariableManager.Instance.get(obj, { $: this.element.$ || this.element, $$: this.element.$$, ...baseContext })
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