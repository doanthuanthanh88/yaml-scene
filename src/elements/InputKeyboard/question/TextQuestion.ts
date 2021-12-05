import { AbsQuestion } from "../AbsQuestion";
import { QuestionType } from "../QuestionType";

export class TextQuestion extends AbsQuestion {
  type = QuestionType.TEXT
}