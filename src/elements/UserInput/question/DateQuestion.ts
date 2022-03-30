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

  async prepare(proxy: ElementProxy<any>) {
    await super.prepare(proxy)
    this.mask = await proxy.getVar(this.mask)
  }
}