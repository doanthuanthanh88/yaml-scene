import { ElementProxy } from "@app/elements/ElementProxy";
import { Question } from "../Question";
import { QuestionType } from "../QuestionType";

export class DateQuestionImpl extends Question {
  type = QuestionType.DATE
  mask: string

  constructor({ mask, ...props }) {
    super(props)
    this.mask = mask
  }

  prepare(proxy: ElementProxy<any>) {
    super.prepare(proxy)
    this.mask = proxy.getVar(this.mask)
  }
}