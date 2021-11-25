import { Question } from "../Question";
import { QuestionType } from "../QuestionType";

export class NumberQuestionImpl extends Question {
  type = QuestionType.NUMBER
}