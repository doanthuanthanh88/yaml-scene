import { TimeUtils } from "@app/utils/time";
import { merge } from "lodash";
import { Element } from "./Element";
import { ElementFactory } from "./ElementFactory";
import { ElementProxy } from "./ElementProxy";

export class Group {
  proxy: ElementProxy<Group>
  private steps: ElementProxy<Element>[]
  title: string
  description: string
  vars: any
  loop: any
  loopKey: string | number
  loopValue: any
  stepDelay: number

  init(_props: any) {
    const { steps = [], ...props } = _props
    merge(this, props)
    const arrs = steps.flat(Number.MAX_SAFE_INTEGER)
    this.steps = arrs.map(step => {
      const [name, vl] = Object.entries(step)[0]
      const elem = ElementFactory.CreateElement<Element>(name as any, this.proxy.tc)
      elem.init(vl)
      return elem
    })
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

  async prepare() {
    if (this.loop) {
      let loop = this.proxy.getVar(this.loop)
      if (typeof loop === 'object') {
        for (const key in loop) {
          const tmp = this.proxy.clone()
          // tmp.parent = this.proxy.parent
          tmp.element.loop = undefined
          tmp.element.loopKey = key
          tmp.element.loopValue = loop[key]
          await tmp.prepare()
          await tmp.exec()
          await tmp.dispose()
        }
      } else {
        while (loop) {
          const tmp = this.proxy.clone()
          tmp.element.loop = undefined
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
    if (this.title) console.group(this.title)
    for (const step of this.steps) {
      await step.prepare()
      await step.exec()
      if (this.stepDelay) {
        await TimeUtils.Delay(this.stepDelay)
      }
    }
    if (this.title) console.groupEnd()
  }

  async dispose() {
    await Promise.all(this.steps.map(step => step?.dispose && step.dispose()))
  }

}