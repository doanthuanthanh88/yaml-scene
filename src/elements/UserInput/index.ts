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
    title: Enter your name
    format: !function |
      (vl) {
          return vl.toUpperCase()
        }
      var: name
      required: true
@example
- UserInput:
    title: Enter password
    type: password
    var: pass
@example
- UserInput:
    title: Enter secret key
    type: invisible
    var: secret
@example
- UserInput:
    title: Enter your age
    type: number
    var: age
@example
- UserInput:
    title: Enter birthday
    type: date
    mask: YYYY-MM-DD HH:mm:ss # Default for date
    var: birthday
@example
- UserInput:
    title: Enter current time
    type: date
    mask: HH:mm:ss
    var: time
@example
- UserInput:
    title: Sex
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
@example
- UserInput:
    title: Suggest Sex
    type: autocomplete
    var: suggestSex
    choices:
      - title: Male
        value: 1
        description: Des
        disabled: false
      - title: Female
        value: -1
@example
- UserInput:
    title: Hobby
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
@example
- UserInput:
    title: Suggest Hobby
    type: autocompleteMultiselect
    var: suggestHobbies
    choices:
      - title: Play football
        value: id0
        description: Des
        disabled: false
      - title: Backet ball
        value: id1
@example
- UserInput:
    title: Agree terms and conditions
    type: toggle
    var: agr
    required: true
@example
- UserInput:
    title: Are you sure to submit ?
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
          question.format = Functional.GetFunction(question.format).getFunctionFromBody() as any
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