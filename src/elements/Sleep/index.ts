import { TimeUtils } from "@app/utils/time"
import { merge } from "lodash"
import { ElementProxy } from "../ElementProxy"

/**
 * Sleep
 * @description Program will be delayed at here after specific time then it keeps playing next steps
 * @example
- Sleep: 10s
- Sleep: 
    title: Sleep 10s
    time: 10s

- Sleep: 10m
- Sleep: 
    title: Sleep 10 minutes
    time: 10m

- Sleep: 10h
- Sleep: 
    title: Sleep 10 hours
    time: 10h

- Sleep: 1000
- Sleep: 
    title: Sleep 1000 miliseconds
    time: 1000

 */
export class Sleep {
  proxy: ElementProxy<Sleep>

  title: string
  time: number

  init(props: any) {
    if (props && typeof props === 'object') {
      merge(this, props)
    } else {
      this.time = props
    }
  }

  prepare() {
    this.title = this.proxy.getVar(this.title)
    this.time = this.proxy.getVar(this.time)
  }

  async exec() {
    await TimeUtils.Delay(this.time)
  }

}