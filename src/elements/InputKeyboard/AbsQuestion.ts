import prompts from 'prompts';
import { ElementProxy } from '../ElementProxy';
import { QuestionType } from "./QuestionType";

export abstract class AbsQuestion {
  title: string
  required: boolean
  pattern: string
  abstract type: QuestionType
  var: string
  default: any
  format: (vl: any) => any

  get config() {
    const { title: message, var: name, default: initial, ...props } = this
    return {
      initial,
      message,
      name,
      ...props,
    }
  }

  constructor({ title, required, pattern, var: varName, default: df, format }: any) {
    this.title = title
    this.required = required
    this.pattern = pattern
    this.var = varName
    this.default = df
    this.format = format
  }

  prepare(proxy: ElementProxy<any>) {
    this.title = proxy.getVar(this.title)
    this.required = proxy.getVar(this.required)
    this.pattern = proxy.getVar(this.pattern)
    this.var = proxy.getVar(this.var)
    this.default = proxy.getVar(this.default)
  }

  async exec() {
    if (!this.var) {
      this.var = `rd${Math.random()}`
    }
    const response = await prompts(this.config)
    return response[this.var]
  }

}
