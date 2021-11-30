import { QuestionType } from "../QuestionType";
import { SelectQuestionImpl } from "./SelectQuestionImpl";

export class AutoCompleteQuestionImpl extends SelectQuestionImpl {
  type = QuestionType.AUTOCOMPLETE
}