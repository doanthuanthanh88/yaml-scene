import { Scenario } from "@app/singleton/Scenario";
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

- Sleep:
    if: ${sayHello}
    title: Sleep before say goodbye after say hello

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
    return (this.element.logLevel ? this.scenario.loggerFactory.getLogger(this.element.logLevel) : this.element.$$?.proxy.logger) || this.scenario.loggerFactory.getLogger()
  }

  constructor(public element: T, public scenario: Scenario) {
    this.element.$ = this.element
    this.element.proxy = this
  }

  init(props: any) {
    const exposeKeys = props['->']
    props = this.inherit(props)
    try {
      if (props?.ref) this.scenario.variableManager.vars.$ref[props.ref] = this.element
      if (this.element.init) {
        return this.element.init(props)
      }
    } finally {
      this.expose(exposeKeys)
    }
  }

  prepare() {
    this.element.logLevel = this.getVar(this.element.logLevel)
    this.element.async = this.getVar(this.element.async)
    this.element.if = this.getVar(this.element.if)
    this.element.delay = this.getVar(this.element.delay)
    if (this.element.prepare) {
      return this.element.prepare()
    }
  }

  isValid() {
    let isOk = true
    if (this.element.if !== undefined) {
      if (typeof this.element.if === 'string') {
        isOk = this.getVar(this.element.if)
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
      let loop = this.getVar(this.element.loop)
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
          loop = this.getVar(this.element.loop)
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
      proxy = new ElementProxy<T>(this.element.clone(), this.scenario)
    } else {
      proxy = new ElementProxy<T>(cloneDeep(this.element), this.scenario)
    }
    this.element.proxy = oldProxy
    if (proxy.element instanceof Group) {
      proxy.element.initSteps(this.scenario)
    }
    return proxy
  }

  resolvePath(path: string) {
    return this.scenario.resolvePath(path)
  }

  changeLogLevel(level: string) {
    this.element.logLevel = level
  }

  declareVar(varObj: any) {
    return this.scenario.variableManager.declare(varObj)
  }

  setVar(varObj: any, obj = {} as any, defaultKey?: string) {
    if (typeof varObj === 'string') {
      return this.scenario.variableManager.set(varObj, obj, defaultKey)
    }
    return this.scenario.variableManager.set(varObj, { $: this.element.$ || this.element, $$: this.element.$$, ...obj }, defaultKey)
  }

  eval(obj: any, baseContext = {} as any) {
    return this.scenario.variableManager.eval(obj, { $: this.element.$ || this.element, $$: this.element.$$, ...baseContext })
  }

  getVar(obj: any, baseContext = {}) {
    return this.scenario.variableManager.get(obj, { $: this.element.$ || this.element, $$: this.element.$$, ...baseContext })
  }

  inherit(props: any) {
    if (props['<-']) {
      const keys = Array.isArray(props['<-']) ? props['<-'] : [props['<-']]
      keys.forEach(key => {
        const temp = this.scenario.templateManager.getElement(key)
        const prop = merge({}, temp, props)
        merge(props, prop)
      })
      props['<-'] = undefined
    }
    return props
  }

  expose(exposeKeys: string[] | string) {
    if (exposeKeys) {
      const keys = Array.isArray(exposeKeys) ? exposeKeys : [exposeKeys]
      keys.forEach(key => {
        this.scenario.templateManager.setElement(key, omit(this.element, '->'))
      })
      this.element['->'] = undefined
    }
  }

}