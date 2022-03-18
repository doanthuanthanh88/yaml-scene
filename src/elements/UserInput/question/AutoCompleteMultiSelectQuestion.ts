import { QuestionType } from "../QuestionType";
import { MultiSelectQuestion } from "./MultiSelectQuestion";

export class AutoCompleteMultiSelectQuestion extends MultiSelectQuestion {
  type = QuestionType.AUTOCOMPLETEMULTISELECT
}
