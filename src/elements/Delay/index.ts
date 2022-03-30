import { TimeUtils } from "@app/utils/TimeUtils"
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
  proxy: ElementProxy<Delay>

  title: string
  time: number

  init(props: any) {
    if (props && typeof props === 'object') {
      merge(this, props)
    } else {
      this.time = props
    }
  }

  async prepare() {
    this.title = await this.proxy.getVar(this.title)
    this.time = await this.proxy.getVar(this.time)
  }

  async exec() {
    if (this.title) {
      this.proxy.logger.info(chalk.yellow(this.title))
    }
    await TimeUtils.Delay(this.time)
  }

}