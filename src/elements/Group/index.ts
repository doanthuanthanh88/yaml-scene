import { LogLevel } from "@app/singleton/LoggerManager";
import chalk from "chalk";
import merge from "lodash.merge";
import { ElementFactory } from "../ElementFactory";
import { ElementProxy } from "../ElementProxy";
import { IElement } from "../IElement";

/**
 * @guide
 * @name Group
 * @description Group contains 1 or many elements
 * @example
- Group:
    title: Run async jobs
    stepDelay: 2s
    steps:
      - Group:
          async: true
          delay: 1s
          stepAsync: true
          steps:
            - Echo: Hello 1
            - Echo: Hello 1.1
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
export default class Group implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  logLevel?: LogLevel
  title?: string
  description?: string
  stepDelay?: number
  stepAsync?: boolean
  steps: any[]

  private _steps?: ElementProxy<IElement>[]

  init(props: any) {
    merge(this, props)
    this.steps = this.steps?.flat(Number.MAX_SAFE_INTEGER) || []
  }

  initStep() {
    this._steps = this.steps.map(step => {
      const [name, vl] = Object.entries(step)[0]
      const elem = ElementFactory.CreateElement<IElement>(name as any)
      elem.init(vl)
      elem.setGroup(this)
      return elem
    })
  }

  async prepare() {
    await this.proxy.applyVars(this, 'title', 'description')
    this.initStep()
  }

  private async execStep(step: ElementProxy<IElement>) {
    if (this.stepDelay && step.element.delay === undefined) {
      step.element.delay = this.stepDelay
    }
    if (this.stepAsync && step.element.async === undefined) {
      step.element.async = this.stepAsync
    }
    await step.exec()
  }

  async exec() {
    if (this.title) this.proxy.logger.info('%s %s', chalk.blue(this.title), chalk.gray(`${this.description || ''}`))
    this.title && console.group()
    try {
      let proms = []
      for (const step of this._steps) {
        if (step.element.async) {
          proms.push(this.execStep(step))
        } else {
          if (proms.length) {
            await Promise.all(proms)
            proms = []
          }
          await this.execStep(step)
        }
      }
      if (proms.length) {
        await Promise.all(proms)
      }
    } finally {
      this.title && console.groupEnd()
    }
  }

  async dispose() {
    const proms = this._steps?.filter(step => step?.dispose).map(step => step.dispose())
    if (proms?.length) {
      await Promise.all(proms)
    }
  }

}