import { Question } from "../Question";
import { QuestionType } from "../QuestionType";

export class ConfirmQuestionImpl extends Question {
  type = QuestionType.CONFIRM
}