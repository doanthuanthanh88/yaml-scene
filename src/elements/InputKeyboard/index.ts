import prompts from 'prompts';
import { ElementProxy } from '../ElementProxy';
import { Question } from './Question';
import { QuestionBuilder } from './QuestionBuilder';
import { QuestionType } from './QuestionType';

export class InputKeyboard {
  proxy: ElementProxy<InputKeyboard>
  private _questions = new Array<Question>()

  init(questionConfigs: any[]) {
    this._questions = questionConfigs.map(({ type, title, required, choices, var: varName }) => {
      const builder = new QuestionBuilder()
      return builder
        .type((type || QuestionType.TEXT) as QuestionType)
        .required(required)
        .title(title)
        .choices(choices)
        .var(varName)
        .build()
    })
  }

  prepare() {
    this._questions.forEach(question => {
      question.title = this.proxy.getVar(question.title)
    })
  }

  async exec() {
    const response = await prompts(this._questions.map(question => question.getConfig()))
    if (response) {
      this.proxy.setVar(response, this)
    }
    return response
  }

}