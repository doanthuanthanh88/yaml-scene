import { TimeUtils } from "@app/utils/time";
import chalk from "chalk";
import { merge } from "lodash";
import { ElementFactory } from "../ElementFactory";
import { ElementProxy } from "../ElementProxy";
import { IElement } from "../IElement";

/**
 * Group
 * @description Group contains 1 or many elements
 * @example
- Group:
    title: Run async jobs
    stepDelay: 2s
    steps:
      - Group:
          async: true
          delay: 1s
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
export class Group implements IElement {
  proxy: ElementProxy<Group>
  title: string
  description: string
  vars: any
  loop: any
  loopKey: string | number
  loopValue: any
  stepDelay?: number
  delay?: number
  async: boolean

  private steps: ElementProxy<IElement>[]

  init(_props: any) {
    const { steps = [], ...props } = _props
    merge(this, props)
    const arrs = steps.flat(Number.MAX_SAFE_INTEGER)
    this.steps = arrs.map(step => {
      const [name, vl] = Object.entries(step)[0]
      const elem = ElementFactory.CreateElement<IElement>(name as any)
      elem.init(vl)
      return elem
    })
  }

  async prepare() {
    if (this.loop) {
      let loop = this.proxy.getVar(this.loop)
      if (typeof loop === 'object') {
        for (const key in loop) {
          const tmp = this.proxy.clone()
          // tmp.parent = this.proxy.parent
          tmp.element['loop'] = undefined
          tmp.element['loopKey'] = key
          tmp.element['loopValue'] = loop[key]
          await tmp.prepare()
          await tmp.exec()
          await tmp.dispose()
        }
      } else {
        while (loop) {
          const tmp = this.proxy.clone()
          tmp.element['loop'] = undefined
          // tmp.parent = this.proxy.parent
          await tmp.prepare()
          await tmp.exec()
          await tmp.dispose()
          loop = this.proxy.getVar(this.loop)
        }
      }
      this.exec = () => Promise.resolve()
    } else {
      this.title = this.proxy.getVar(this.title)
      this.description = this.proxy.getVar(this.description)
      this.handleInheritExpose()
    }
  }

  async exec() {
    if (this.delay) {
      await TimeUtils.Delay(this.delay)
    }
    if (this.title) this.proxy.logger.info('%s %s', chalk.blue(this.title), chalk.gray(`${this.description || ''}`))
    console.group()
    const proms = []
    for (const step of this.steps) {
      if (step.element.async) {
        await step.prepare()
        if (this.stepDelay && !step.element.delay) {
          step.element.delay = this.stepDelay
        }
        proms.push(step.exec())
        continue
      }
      if (proms.length) {
        await Promise.all(proms)
        proms.splice(0, proms.length)
      }
      await step.prepare()
      if (this.stepDelay && !step.element.delay) {
        step.element.delay = this.stepDelay
      }
      await step.exec()
    }
    if (proms.length) {
      await Promise.all(proms)
      proms.splice(0, proms.length)
    }
    console.groupEnd()
  }

  async dispose() {
    if (!this.steps) return
    await Promise.all(this.steps.map(step => step?.dispose && step.dispose()))
  }

  handleInheritExpose() {
    for (const elemProxy of this.steps) {
      let inheritKey: string[]
      let exposeKey: string
      const { '<-': _inheritKey, '->': _exposeKey } = elemProxy.element as any
      inheritKey = _inheritKey
      exposeKey = _exposeKey
      if (inheritKey) {
        if (typeof inheritKey === 'string') {
          inheritKey = [inheritKey]
        }
      }
      elemProxy.inherit(inheritKey)
      elemProxy.expose(exposeKey)
      elemProxy.__ = this
      elemProxy.element['<-'] = elemProxy.element['->'] = undefined
    }
  }

}