import { Question } from "../Question";
import { QuestionType } from "../QuestionType";

export class PasswordQuestionImpl extends Question {
  type = QuestionType.PASSWORD
}