import { ElementProxy } from "@app/elements/ElementProxy";
import merge from "lodash.merge";
import UserInput from "..";
import { QuestionType } from "../QuestionType";
import { SelectQuestion } from "./SelectQuestion";

export class AutoCompleteQuestion extends SelectQuestion {
  type = QuestionType.AUTOCOMPLETE
  suggest?: (input: string, choices: any[]) => (any | Promise<any>)[]

  constructor(config: any) {
    super(config)
    merge(this, config)
  }

  async prepare(proxy: ElementProxy<UserInput>): Promise<void> {
    await proxy.applyVars(this, 'suggest')
    await super.prepare(proxy)
  }
}