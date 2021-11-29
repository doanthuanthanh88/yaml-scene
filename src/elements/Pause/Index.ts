import { TimeUtils } from "@app/utils/time"
import chalk from "chalk"
import { merge } from "lodash"
import { ElementProxy } from "../ElementProxy"
import { QuestionBuilder } from "../InputKeyboard/QuestionBuilder"
import { QuestionType } from "../InputKeyboard/QuestionType"

export class Pause {
  proxy: ElementProxy<Pause>

  title: string
  time: number

  init(props: any) {
    if (props && typeof props !== 'object') {
      this.time = props
    } else {
      merge(this, props)
    }
  }

  prepare() {
    this.title = this.proxy.getVar(this.title)
    this.time = this.proxy.getVar(this.time)
  }

  async exec() {
    if (this.time) {
      await this.delay()
    } else {
      await this.pause()
    }
  }

  private async pause() {
    const ques = new QuestionBuilder()
      .type(QuestionType.CONFIRM)
      .title(chalk.yellow(this.title || 'Continue'))
      .build()
    const rs = await ques.exec()
    if (!rs) {
      throw new Error('Stop')
    }
  }

  private delay() {
    if (this.title) this.proxy.logger.info(this.title)
    return new Promise((r) => {
      const time = TimeUtils.GetMsTime(this.time)
      setTimeout(() => {
        return r(undefined)
      }, time)
    })
  }

}