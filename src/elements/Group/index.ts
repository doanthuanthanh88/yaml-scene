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
export default class Group implements IElement {
  proxy: ElementProxy<Group>
  title: string
  description: string
  stepDelay?: number
  steps: any[]

  private _steps: ElementProxy<IElement>[]

  init(_props: any) {
    const { ...props } = _props
    merge(this, props)
    this.steps = this.steps?.flat(Number.MAX_SAFE_INTEGER) || []
    this.initSteps()
  }

  initSteps() {
    this._steps = this.steps.map(step => {
      const [name, vl] = Object.entries(step)[0]
      const elem = ElementFactory.CreateElement<IElement>(name as any)
      elem.init(vl)
      elem.setGroup(this)
      return elem
    })
  }

  async prepare() {
    this.title = await this.proxy.getVar(this.title)
    this.description = await this.proxy.getVar(this.description)
  }

  async exec() {
    if (this.title) this.proxy.logger.info('%s %s', chalk.blue(this.title), chalk.gray(`${this.description || ''}`))
    console.group()
    const proms = []
    for (const step of this._steps) {
      if (step.element.async) {
        const isValid = await step.isValid()
        if (isValid) {
          proms.push((async (step) => {
            await step.prepare()
            if (this.stepDelay && !step.element.delay) {
              step.element.delay = this.stepDelay
            }
            await step.exec()
          })(step))
        }
        continue
      }
      if (proms.length) {
        await Promise.all(proms)
        proms.splice(0, proms.length)
      }
      const isValid = await step.isValid()
      if (isValid) {
        await step.prepare()
        if (this.stepDelay && !step.element.delay) {
          step.element.delay = this.stepDelay
        }
        await step.exec()
      }
    }
    if (proms.length) {
      await Promise.all(proms)
      proms.splice(0, proms.length)
    }
    console.groupEnd()
  }

  async dispose() {
    if (!this._steps) return
    await Promise.all(this._steps.map(step => step?.dispose && step.dispose()))
  }

}