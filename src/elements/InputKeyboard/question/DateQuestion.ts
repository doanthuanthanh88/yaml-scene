import { ElementProxy } from "@app/elements/ElementProxy";
import { AbsQuestion } from "../AbsQuestion";
import { QuestionType } from "../QuestionType";

export class DateQuestion extends AbsQuestion {
  type = QuestionType.DATE
  mask: string

  constructor(_props: any) {
    const { mask, ...props } = _props
    super(props)
    this.mask = mask
  }

  prepare(proxy: ElementProxy<any>) {
    super.prepare(proxy)
    this.mask = proxy.getVar(this.mask)
  }
}