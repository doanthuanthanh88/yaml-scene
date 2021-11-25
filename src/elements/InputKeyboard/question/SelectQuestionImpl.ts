import { Question } from "../Question";
import { QuestionType } from "../QuestionType";

export class SelectQuestionImpl extends Question {
  type = QuestionType.SELECT
  choices?: { title: string, value: any }[]

  constructor(config: any) {
    if (!config.choices) {
      throw new Error(`Need add choices in SelectQuestion type`)
    }
    super(config)
    this.choices = config.choices
  }

}