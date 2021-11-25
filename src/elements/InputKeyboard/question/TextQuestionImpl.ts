import { Question } from "../Question";
import { QuestionType } from "../QuestionType";

export class TextQuestionImpl extends Question {
  type = QuestionType.TEXT
}