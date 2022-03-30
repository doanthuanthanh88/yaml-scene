import { TraceError } from "@app/utils/error/TraceError"
import { TimeUtils } from "@app/utils/TimeUtils"
import chalk from "chalk"
import merge from "lodash.merge"
import Delay from "../Delay"
import { ElementFactory } from "../ElementFactory"
import { ElementProxy } from "../ElementProxy"
import { IElement } from "../IElement"
import { QuestionBuilder } from "../UserInput/QuestionBuilder"
import { QuestionType } from "../UserInput/QuestionType"

/**
 * @guide
 * @name Pause
 * @description Program will be paused and wait user input
 * @example
- Pause:
    title: It keeps playing when user enter OR after 1 second, user not enter then it keeps playing
    timeout: 1s

- Pause: 2s       # Delay 2 seconds then it keeps playing

- Pause:
    title: Delay 3 seconds then it keeps playing
    time: 3s

- Pause:          # It will be paused until user enter
 * @end
 */
export default class Pause implements IElement {
  proxy: ElementProxy<Pause>

  title: string
  time: number
  timeout: number

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
    this.timeout = await this.proxy.getVar(this.timeout)
  }

  async exec() {
    if (this.time) {
      const sleep = ElementFactory.CreateElement<Delay>('Delay')
      sleep.init({
        title: this.title,
        time: this.time
      })
      await sleep.prepare()
      await sleep.exec()
      return
    }
    const ques = new QuestionBuilder()
      .type(QuestionType.CONFIRM)
      .title(chalk.yellow(this.title || 'Continue'))
      .default(true)
      .build()
    let tm: NodeJS.Timeout
    if (this.timeout) {
      tm = setTimeout(() => ques.sendKey(), TimeUtils.GetMsTime(this.timeout))
    }
    try {
      const rs = await ques.exec()
      if (!rs) {
        throw new TraceError('Stop')
      }
    } finally {
      tm && clearTimeout(tm)
    }
  }

}