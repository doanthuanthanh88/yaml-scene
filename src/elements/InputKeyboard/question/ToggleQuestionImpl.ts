import { Question } from "../Question";
import { QuestionType } from "../QuestionType";

export class ToggleQuestionImpl extends Question {
  type = QuestionType.TOGGLE
}