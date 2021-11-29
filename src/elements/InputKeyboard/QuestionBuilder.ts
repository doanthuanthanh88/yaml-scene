import { Question } from "./Question"
import { ConfirmQuestionImpl } from "./question/ConfirmQuestionImpl"
import { DateQuestionImpl } from "./question/DateQuestionImpl"
import { InvisibleQuestionImpl } from "./question/InvisibleQuestionImpl"
import { MultiSelectQuestionImpl } from "./question/MultiSelectQuestionImpl"
import { NumberQuestionImpl } from "./question/NumberQuestionImpl"
import { PasswordQuestionImpl } from "./question/PasswordQuestionImpl"
import { SelectQuestionImpl } from "./question/SelectQuestionImpl"
import { TextQuestionImpl } from "./question/TextQuestionImpl"
import { ToggleQuestionImpl } from "./question/ToggleQuestionImpl"
import { QuestionType } from "./QuestionType"

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

  default(defaultValue: any) {
    this._config.default = defaultValue
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
