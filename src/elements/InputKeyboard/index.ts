import chalk from 'chalk';
import prompts from 'prompts';
import { ElementProxy } from '../ElementProxy';
import { Question } from './Question';
import { QuestionBuilder } from './QuestionBuilder';
import { QuestionType } from './QuestionType';

export class InputKeyboard {
  proxy: ElementProxy<InputKeyboard>
  private _questions = new Array<Question>()

  init(questionConfigs: any[]) {
    this._questions = questionConfigs.map(({ type, title, required, choices, var: varName, default: df, format, mask }) => {
      const builder = new QuestionBuilder()
      const ques = builder
        .type((type || QuestionType.TEXT) as QuestionType)
        .required(required)
        .title(chalk.cyan(title))
        .var(varName)
        .default(df)
        .format(this.proxy.eval(format))
      if (type === QuestionType.SELECT || type === QuestionType.MULTISELECT) {
        ques.choices(choices)
      } else if (type === QuestionType.DATE) {
        ques.masks(mask)
      }
      return ques.build()
    })
  }

  prepare() {
    this._questions.forEach(question => {
      question.prepare(this.proxy)
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