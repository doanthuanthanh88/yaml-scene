import { Question } from "./Question"
import { QuestionType } from "./QuestionType"
import { SelectQuestionImpl } from "./question/SelectQuestionImpl"
import { PasswordQuestionImpl } from "./question/PasswordQuestionImpl"
import { InvisibleQuestionImpl } from "./question/InvisibleQuestionImpl"
import { NumberQuestionImpl } from "./question/NumberQuestionImpl"
import { ConfirmQuestionImpl } from "./question/ConfirmQuestionImpl"
import { ToggleQuestionImpl } from "./question/ToggleQuestionImpl"
import { MultiSelectQuestionImpl } from "./question/MultiSelectQuestionImpl"
import { DateQuestionImpl } from "./question/DateQuestionImpl"
import { TextQuestionImpl } from "./question/TextQuestionImpl"

export class QuestionBuilder {
  private _config = {} as Question & any
  private _type: QuestionType

  type(type: QuestionType) {
    this._type = type
    return this
  }

  title(title: string) {
    this._config.title = title
    return this
  }

  var(varName: string) {
    if (!varName) {
      throw new Error('Need declare "var" to assign value to')
    }
    this._config.var = varName
    return this
  }

  required(isRequired: boolean) {
    this._config.required = isRequired
    return this
  }

  choices(choices: { title: string, value: string }[]) {
    this._config.choices = choices
    return this
  }

  build() {
    switch (this._type) {
      case QuestionType.TEXT:
        return new TextQuestionImpl(this._config)
      case QuestionType.PASSWORD:
        return new PasswordQuestionImpl(this._config)
      case QuestionType.INVISIBLE:
        return new InvisibleQuestionImpl(this._config)
      case QuestionType.NUMBER:
        return new NumberQuestionImpl(this._config)
      case QuestionType.CONFIRM:
        return new ConfirmQuestionImpl(this._config)
      case QuestionType.TOGGLE:
        return new ToggleQuestionImpl(this._config)
      case QuestionType.SELECT:
        return new SelectQuestionImpl(this._config)
      case QuestionType.MULTISELECT:
        return new MultiSelectQuestionImpl(this._config)
      case QuestionType.DATE:
        return new DateQuestionImpl(this._config)
      default:
        throw new Error(`Could not found Question Type "${this.type}"`)
    }
  }

}
