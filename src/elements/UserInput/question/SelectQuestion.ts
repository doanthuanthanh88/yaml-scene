import { TraceError } from "@app/utils/error/TraceError";
import { AbsQuestion } from "../AbsQuestion";
import { QuestionType } from "../QuestionType";

export class SelectQuestion extends AbsQuestion {
  type = QuestionType.SELECT
  choices?: { title: string, value: any }[]

  constructor(config: any) {
    if (!config.choices) {
      throw new TraceError(`Need add choices in SelectQuestion type`, { config })
    }
    super(config)
    this.choices = config.choices
  }

  prepare(proxy) {
    super.prepare(proxy)
    this.choices?.forEach((choice, i) => {
      choice.title = proxy.getVar(choice.title)
      choice.value = proxy.getVar(choice.value)
      if (this.default !== undefined && this.default === choice.value) {
        this.default = +i
      }
    })
  }

}