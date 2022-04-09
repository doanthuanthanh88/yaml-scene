import { TimeUnit, TimeUtils } from "@app/utils/TimeUtils"
import chalk from "chalk"
import merge from "lodash.merge"
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
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  title?: string
  time?: number
  timeout?: number

  init(props: any) {
    if (props && typeof props === 'object') {
      merge(this, props)
    } else {
      this.time = props
    }
  }

  async prepare() {
    await this.proxy.applyVars(this, 'title', 'time', 'timeout')
    this.time = TimeUtils.GetMsTime(this.time as TimeUnit)
    this.timeout = TimeUtils.GetMsTime(this.timeout as TimeUnit)
  }

  async exec() {
    let tm: NodeJS.Timeout
    try {
      if (this.time) {
        await TimeUtils.Delay(this.time)
      } else {
        const ques = new QuestionBuilder()
          .type(QuestionType.CONFIRM)
          .title(chalk.yellow(this.title || 'Continue'))
          .default(true)
          .build()
        tm = this.timeout && setTimeout(() => ques.sendKey(), this.timeout)
        await ques.exec()
      }
    } finally {
      if (tm) clearTimeout(tm)
    }
  }

}