import { ElementProxy } from "@app/elements/ElementProxy";
import merge from "lodash.merge";
import UserInput from "..";
import { AbsQuestion } from "../AbsQuestion";
import { QuestionType } from "../QuestionType";

export class DateQuestion extends AbsQuestion {
  type = QuestionType.DATE
  mask: string

  constructor(_props: any) {
    const { mask, ...props } = _props
    super(props)
    merge(this, props)
    this.mask = mask
  }

  async prepare(proxy: ElementProxy<UserInput>) {
    await super.prepare(proxy)
    await proxy.applyVars(this, 'mask')
  }
}