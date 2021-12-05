import chalk from 'chalk';
import prompts from 'prompts';
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';
import { AbsQuestion } from './AbsQuestion';
import { QuestionBuilder } from './QuestionBuilder';
import { QuestionType } from './QuestionType';

export class InputKeyboard implements IElement {
  proxy: ElementProxy<InputKeyboard>

  private _questions = new Array<AbsQuestion>()

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
      if (type === QuestionType.SELECT || type === QuestionType.MULTISELECT || type === QuestionType.AUTOCOMPLETE || type === QuestionType.AUTOCOMPLETEMULTISELECT) {
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
    const response = await prompts(this._questions.map(question => question.config))
    if (response) {
      this.proxy.setVar(response, this)
    }
    return response
  }

}