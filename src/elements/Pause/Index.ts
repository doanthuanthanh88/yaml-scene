import { TimeUtils } from "@app/utils/time"
import { merge } from "lodash"
import { ElementProxy } from "../ElementProxy"
import { ConfirmQuestionImpl } from "../InputKeyboard/question/ConfirmQuestionImpl"

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
    if (this.title) console.log(this.title)
    if (this.time) {
      await this.delay()
    } else {
      await this.pause()
    }
  }

  private async pause() {
    const ques = new ConfirmQuestionImpl({
      title: 'Continue ?'
    })
    const rs = await ques.exec()
    if (!rs) {
      throw new Error('Stop')
    }
  }

  private delay() {
    return new Promise((r) => {
      const time = TimeUtils.GetMsTime(this.time)
      setTimeout(() => {
        return r(undefined)
      }, time)
    })
  }

}