import { ElementProxy } from "@app/elements/ElementProxy";
import { TraceError } from "@app/utils/error/TraceError";
import merge from "lodash.merge";
import UserInput from "..";
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
    merge(this, config)
  }

  async prepare(proxy: ElementProxy<UserInput>) {
    await super.prepare(proxy)
    await proxy.applyVars(this, 'choices')
    if (this.choices?.length) {
      await Promise.all(this.choices.map(async (choice, i) => {
        if (this.default !== undefined && this.default === choice.value) {
          this.default = +i
        }
      }))
    }
  }

}