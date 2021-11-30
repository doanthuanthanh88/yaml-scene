import { QuestionType } from "../QuestionType";
import { MultiSelectQuestionImpl } from "./MultiSelectQuestionImpl";

export class AutoCompleteMultiSelectQuestionImpl extends MultiSelectQuestionImpl {
  type = QuestionType.AUTOCOMPLETEMULTISELECT
}