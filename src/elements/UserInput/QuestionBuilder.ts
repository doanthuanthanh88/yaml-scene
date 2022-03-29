import { TraceError } from "@app/utils/error/TraceError"
import merge from "lodash.merge"
import { AutoCompleteMultiSelectQuestion } from "./question/AutoCompleteMultiSelectQuestion"
import { AutoCompleteQuestion } from "./question/AutoCompleteQuestion"
import { ConfirmQuestion } from "./question/ConfirmQuestion"
import { DateQuestion } from "./question/DateQuestion"
import { InvisibleQuestion } from "./question/InvisibleQuestion"
import { MultiSelectQuestion } from "./question/MultiSelectQuestion"
import { NumberQuestion } from "./question/NumberQuestion"
import { PasswordQuestion } from "./question/PasswordQuestion"
import { SelectQuestion } from "./question/SelectQuestion"
import { TextQuestion } from "./question/TextQuestion"
import { ToggleQuestion } from "./question/ToggleQuestion"
import { QuestionType } from "./QuestionType"

type QuestionBuilderConfig = {
  title?: string
  default?: any
  var?: string
  format?: (vl: any) => any
  required?: boolean
  choices?: { title: string, value: string }[]
  mask?: string
}

export class QuestionBuilder {
  private _config: QuestionBuilderConfig = {}
  private _type: QuestionType

  type(type: QuestionType) {
    this._type = type
    return this
  }

  opts(opts: any) {
    merge(this._config, { opts })
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
      throw new TraceError('"var" is required')
    }
    this._config.var = varName
    return this
  }

  format(format: (vl: any) => any) {
    if (format) {
      this._config.format = format
    }
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

  masks(mask = 'YYYY-MM-DD HH:mm:ss') {
    if (this._type === QuestionType.DATE) {
      this._config.mask = mask
    }
    return this
  }

  build() {
    switch (this._type) {
      case QuestionType.TEXT:
        return new TextQuestion(this._config)
      case QuestionType.PASSWORD:
        return new PasswordQuestion(this._config)
      case QuestionType.INVISIBLE:
        return new InvisibleQuestion(this._config)
      case QuestionType.NUMBER:
        return new NumberQuestion(this._config)
      case QuestionType.CONFIRM:
        return new ConfirmQuestion(this._config)
      case QuestionType.TOGGLE:
        return new ToggleQuestion(this._config)
      case QuestionType.SELECT:
        return new SelectQuestion(this._config)
      case QuestionType.MULTISELECT:
        return new MultiSelectQuestion(this._config)
      case QuestionType.AUTOCOMPLETE:
        return new AutoCompleteQuestion(this._config)
      case QuestionType.AUTOCOMPLETEMULTISELECT:
        return new AutoCompleteMultiSelectQuestion(this._config)
      case QuestionType.DATE:
        return new DateQuestion(this._config)
      default:
        throw new TraceError(`Could not found Question Type "${this.type}"`, { QuestionBuilder: this })
    }
  }

}
