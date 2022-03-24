import { TimeUtils } from "@app/utils/TimeUtils"
import chalk from "chalk"
import merge from "lodash.merge"
import { ElementFactory } from "../ElementFactory"
import { ElementProxy } from "../ElementProxy"
import { QuestionBuilder } from "../UserInput/QuestionBuilder"
import { QuestionType } from "../UserInput/QuestionType"
import Sleep from "../Sleep"

/**
 * @guide
 * @name Pause
 * @description Program will be paused and wait user input
 * @example
- Pause:
    title: It keeps playing when user enter OR after 1 second, user not enter then it keeps playing
    timeout: 1s

- Pause: 2s       # Sleep 2 seconds then it keeps playing

- Pause:
    title: Sleep 3 seconds then it keeps playing
    time: 3s

- Pause:          # It will be paused until user enter
 * @end
 */
export default class Pause {
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

  prepare() {
    this.title = this.proxy.getVar(this.title)
    this.time = this.proxy.getVar(this.time)
    this.timeout = this.proxy.getVar(this.timeout)
  }

  async exec() {
    if (this.time) {
      const sleep = ElementFactory.CreateElement<Sleep>('Sleep', this.proxy.scenario)
      sleep.init({
        title: this.title,
        time: this.time
      })
      sleep.prepare()
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
        throw new Error('Stop')
      }
    } finally {
      tm && clearTimeout(tm)
    }
  }

}