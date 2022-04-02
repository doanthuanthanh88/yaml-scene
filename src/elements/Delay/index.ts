import { TraceError } from "@app/utils/error/TraceError"
import { TimeUnit, TimeUtils } from "@app/utils/TimeUtils"
import chalk from "chalk"
import merge from "lodash.merge"
import { ElementProxy } from "../ElementProxy"
import { IElement } from "../IElement"

/**
 * @guide
 * @name Delay
 * @description Program will be delayed at here after specific time then it keeps playing next steps
 * @example
- Delay: 10s
- Delay: 
    title: Delay 10s
    time: 10s

- Delay: 10m
- Delay: 
    title: Delay 10 minutes
    time: 10m

- Delay: 10h
- Delay: 
    title: Delay 10 hours
    time: 10h

- Delay: 1000
- Delay: 
    title: Delay 1000 miliseconds
    time: 1000
 * @end
 */
export default class Delay implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  title?: string
  time: TimeUnit

  init(props: any) {
    if (props && typeof props === 'object') {
      merge(this, props)
    } else {
      this.time = props
    }
  }

  async prepare() {
    await this.proxy.applyVars(this, 'title', 'time')
    this.time = TimeUtils.GetMsTime(this.time)
    if (!this.time) throw new TraceError('Time is required')
  }

  async exec() {
    if (this.title) {
      this.proxy.logger.info(chalk.yellow(this.title))
    }
    await TimeUtils.Delay(this.time)
  }

}