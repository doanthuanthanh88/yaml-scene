import { VariableManager } from '@app/singleton/VariableManager';
import { Functional } from '@app/tags/model/Functional';
import chalk from 'chalk';
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';
import { AbsQuestion } from './AbsQuestion';
import { QuestionBuilder } from './QuestionBuilder';
import { QuestionType } from './QuestionType';

/*****
@name UserInput
@description Get user input from keyboard
@group Input
@example
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
          description: Des
          disabled: false
        - title: Female
          value: -1

    - title: Suggest Sex
      type: autocomplete
      var: suggestSex
      choices:
        - title: Male
          value: 1
          description: Des
          disabled: false
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
          description: Des
          disabled: false
        - title: Backet ball
          value: id1

    - title: Suggest Hobby
      type: autocompleteMultiselect
      var: suggestHobbies
      choices:
        - title: Play football
          value: id0
          description: Des
          disabled: false
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
*/
export default class UserInput implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  private _questions: AbsQuestion[]
  private questionConfigs: any[]

  init(_questionConfigs: any[] | any) {
    this.questionConfigs = Array.isArray(_questionConfigs) ? _questionConfigs : [_questionConfigs]
  }

  async prepare() {
    this._questions = this.questionConfigs?.map(({ type, title, required, choices, var: varName, default: df, format, mask, ...otherConfigs }) => {
      const builder = new QuestionBuilder()
      const ques = builder
        .type((type || QuestionType.TEXT) as QuestionType)
        .required(required)
        .title(chalk.cyan(title))
        .var(varName)
        .default(df)
        .format(format)
        .config(otherConfigs)
      if (type === QuestionType.SELECT || type === QuestionType.MULTISELECT || type === QuestionType.AUTOCOMPLETE || type === QuestionType.AUTOCOMPLETEMULTISELECT) {
        ques.choices(choices)
      } else if (type === QuestionType.DATE) {
        ques.masks(mask)
      }
      return ques.build()
    }) || []

    if (this._questions.length) {
      await Promise.all(this._questions.map(async question => {
        if (question.format) {
          question.format = await this.proxy.eval<(vl: any) => any>(Functional.GetFuntion(question.format)?.toReturn())
        }
        await question.prepare(this.proxy)
      }))
    }
  }

  async exec() {
    const response = {}
    for (const question of this._questions) {
      const res = await question.exec()
      Object.assign(response, { [question.var]: null }, res)
    }
    if (this.proxy.isAttacted) {
      Object.assign(VariableManager.Instance.vars, response)
    }
    return response
  }

  async dispose() {
    await Promise.all(this._questions.map(question => question.dispose()))
  }

}