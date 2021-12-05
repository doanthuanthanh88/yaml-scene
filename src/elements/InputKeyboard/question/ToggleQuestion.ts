import { AbsQuestion } from "../AbsQuestion";
import { QuestionType } from "../QuestionType";

export class ToggleQuestion extends AbsQuestion {
  type = QuestionType.TOGGLE
}