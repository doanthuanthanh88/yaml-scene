import { AbsQuestion } from "../AbsQuestion";
import { QuestionType } from "../QuestionType";

export class PasswordQuestion extends AbsQuestion {
  type = QuestionType.PASSWORD
}