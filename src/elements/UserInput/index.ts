import { Functional } from '@app/tags/model/Functional';
import chalk from 'chalk';
import prompts from 'prompts';
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';
import { AbsQuestion } from './AbsQuestion';
import { QuestionBuilder } from './QuestionBuilder';
import { QuestionType } from './QuestionType';

/**
 * @guide
 * @name UserInput
 * @description Get user input from keyboard
 * @group Input
 * @example
- UserInput:
    - title: Enter your name
      type: text # Default is text if not specific
      format: !function |
        vl => vl.toUpperCase()
      var: name
      required: true

    - title: Enter password
      type: password
      var: pass

    - title: Enter secret key
      type: invisible
      var: secret

    - title: Enter your age
      type: number
      var: age

    - title: Enter birthday
      type: date
      mask: YYYY-MM-DD HH:mm:ss # Default for date
      var: birthday

    - title: Enter current time
      type: date
      mask: HH:mm:ss
      var: time

    - title: Sex
      type: select
      var: sex
      default: -1
      choices:
        - title: Male
          value: 1
        - title: Female
          value: -1

    - title: Suggest Sex
      type: autocomplete
      var: suggestSex
      choices:
        - title: Male
          value: 1
        - title: Female
          value: -1

    - title: Hobby
      type: multiselect
      var: hobbies
      default:
        - id0
        - id1
      choices:
        - title: Play football
          value: id0
        - title: Backet ball
          value: id1

    - title: Suggest Hobby
      type: autocompleteMultiselect
      var: suggestHobbies
      choices:
        - title: Play football
          value: id0
        - title: Backet ball
          value: id1

    - title: Agree terms and conditions
      type: toggle
      var: agr
      required: true

    - title: Are you sure to submit ?
      type: confirm
      default: true
      var: submit
 * @end
 */
export default class UserInput implements IElement {
  proxy: ElementProxy<UserInput>

  private _questions = new Array<AbsQuestion>()

  init(_questionConfigs: any[] | any) {
    const questionConfigs = Array.isArray(_questionConfigs) ? _questionConfigs : [_questionConfigs]
    this._questions = questionConfigs.map(({ type, title, required, choices, var: varName, default: df, format, mask }) => {
      const builder = new QuestionBuilder()
      const ques = builder
        .type((type || QuestionType.TEXT) as QuestionType)
        .required(required)
        .title(chalk.cyan(title))
        .var(varName)
        .default(df)
        .format(this.proxy.eval(Functional.GetFuntion(format)?.toReturn()))
      if (type === QuestionType.SELECT || type === QuestionType.MULTISELECT || type === QuestionType.AUTOCOMPLETE || type === QuestionType.AUTOCOMPLETEMULTISELECT) {
        ques.choices(choices)
      } else if (type === QuestionType.DATE) {
        ques.masks(mask)
      }
      return ques.build()
    })
  }

  async prepare() {
    if (this._questions?.length) {
      await Promise.all([
        this._questions.map(async question => {
          await question.prepare(this.proxy)
        })
      ])
    }
  }

  async exec() {
    const response = await prompts(this._questions.map(question => question.config))
    if (response) {
      await this.proxy.setVar(response, this)
    }
    return response
  }

  async dispose() {
    await Promise.all(this._questions.map(question => question.dispose()))
  }

}