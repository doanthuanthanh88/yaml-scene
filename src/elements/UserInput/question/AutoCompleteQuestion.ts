import { QuestionType } from "../QuestionType";
import { SelectQuestion } from "./SelectQuestion";

export class AutoCompleteQuestion extends SelectQuestion {
  type = QuestionType.AUTOCOMPLETE
}