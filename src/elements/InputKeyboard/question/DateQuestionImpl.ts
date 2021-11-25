import { Question } from "../Question";
import { QuestionType } from "../QuestionType";

export class DateQuestionImpl extends Question {
  type = QuestionType.DATE
}