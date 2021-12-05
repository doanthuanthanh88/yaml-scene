import { AbsQuestion } from "../AbsQuestion";
import { QuestionType } from "../QuestionType";

export class ConfirmQuestion extends AbsQuestion {
  type = QuestionType.CONFIRM
}