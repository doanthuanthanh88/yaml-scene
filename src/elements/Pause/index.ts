import { TimeUnit, TimeUtils } from "@app/utils/TimeUtils"
import chalk from "chalk"
import merge from "lodash.merge"
import { ElementProxy } from "../ElementProxy"
import { IElement } from "../IElement"
import { AbsQuestion } from "../UserInput/AbsQuestion"
import { QuestionBuilder } from "../UserInput/QuestionBuilder"
import { QuestionType } from "../UserInput/QuestionType"

/*****
@name Pause
@description Program will be paused and wait user input
@example
- Pause:
    title: It keeps playing when user enter OR after 1 second, user not enter then it keeps playing
    timeout: 1s

@example
- Pause: 2s       # Delay 2 seconds then it keeps playing

@example
- Pause:
    title: Delay 3 seconds then it keeps playing
    time: 3s

@example
- Pause:          # It will be paused until user enter
*/
export default class Pause implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  title?: string
  time?: number
  timeout?: number

  private ques: AbsQuestion

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
        this.ques = new QuestionBuilder()
          .type(QuestionType.CONFIRM)
          .title(chalk.yellow(this.title || 'Continue'))
          .default(true)
          .build()
        tm = this.timeout && setTimeout(() => this.stop(), this.timeout)
        await this.ques.exec()
      }
    } finally {
      if (tm) clearTimeout(tm)
    }
  }

  stop() {
    this.ques.sendKey()
  }

}