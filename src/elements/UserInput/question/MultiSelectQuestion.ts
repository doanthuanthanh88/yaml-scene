import { TraceError } from "@app/utils/error/TraceError";
import { AbsQuestion } from "../AbsQuestion";
import { QuestionType } from "../QuestionType";

export class MultiSelectQuestion extends AbsQuestion {
  type = QuestionType.MULTISELECT
  choices?: { title: string, value: any, selected?: boolean }[]

  constructor(config: any) {
    if (!config.choices) {
      throw new TraceError(`Need add choices in MultiSelectQuestion type`, { config })
    }
    super(config)
    this.choices = config.choices
  }

  prepare(proxy) {
    super.prepare(proxy)
    let df = this.default
    if (df !== undefined) {
      if (!Array.isArray(df)) df = [df]
      this.default = []
    }
    this.choices?.forEach((choice) => {
      choice.title = proxy.getVar(choice.title)
      choice.value = proxy.getVar(choice.value)
      if (df?.includes(choice.value)) {
        choice.selected = true
      }
    })
  }

}