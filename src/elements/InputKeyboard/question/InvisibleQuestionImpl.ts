import { Question } from "../Question";
import { QuestionType } from "../QuestionType";

export class InvisibleQuestionImpl extends Question {
  type = QuestionType.INVISIBLE
}