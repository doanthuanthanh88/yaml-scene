import { ElementProxy } from "@app/elements/ElementProxy";
import { TraceError } from "@app/utils/error/TraceError";
import merge from "lodash.merge";
import UserInput from "..";
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
    merge(this, config)
  }

  async prepare(proxy: ElementProxy<UserInput>) {
    await super.prepare(proxy)
    await proxy.applyVars(this, 'choices')
    if (this.default !== undefined && !Array.isArray(this.default)) {
      this.default = [this.default]
    }
    if (this.choices?.length) {
      await Promise.all(this.choices.map(async (choice) => {
        if (this.default?.includes(choice.value)) {
          choice.selected = true
        }
      }))
    }
  }

}