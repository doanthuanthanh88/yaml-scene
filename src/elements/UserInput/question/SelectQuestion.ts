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

  async prepare(proxy) {
    await super.prepare(proxy)
    this.choices = await proxy.getVar(this.choices)
    if (this.choices?.length) {
      await Promise.all(this.choices.map(async (choice, i) => {
        if (this.default !== undefined && this.default === choice.value) {
          this.default = +i
        }
      }))
    }
  }

}