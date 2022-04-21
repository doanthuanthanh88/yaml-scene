import { ElementProxy } from "@app/elements/ElementProxy";
import { Functional } from "@app/tags/model/Functional";
import merge from "lodash.merge";
import UserInput from "..";
import { QuestionType } from "../QuestionType";
import { AutoCompleteSuggestion } from "./AutoCompleteSuggestion";
import { SelectQuestion } from "./SelectQuestion";

export class AutoCompleteQuestion extends SelectQuestion {
  type = QuestionType.AUTOCOMPLETE
  suggest?: string | ((input: string, choices: any[]) => (any | Promise<any>)[])

  constructor(config: any) {
    super(config)
    merge(this, config)
  }

  async prepare(proxy: ElementProxy<UserInput>): Promise<void> {
    if (this.suggest) {
      if (typeof this.suggest === 'string') {
        this.suggest = AutoCompleteSuggestion[this.suggest]
      } else {
        this.suggest = Functional.GetFunction(this.suggest).getFunctionFromBody() as any
      }
    }
    await super.prepare(proxy)
  }
}