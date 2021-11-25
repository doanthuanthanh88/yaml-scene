import prompts from 'prompts';
import { QuestionType } from "./QuestionType";

export abstract class Question {
  title: string
  required: boolean
  pattern: string
  abstract type: QuestionType
  var: string

  constructor({ title, required, pattern, var: varName }: any) {
    this.title = title
    this.required = required
    this.pattern = pattern
    this.var = varName
  }

  async exec() {
    if (!this.var) {
      this.var = `rd${Math.random()}`
    }
    const response = await prompts(this.getConfig())
    return response[this.var]
  }

  getConfig() {
    const { title: message, var: name, ...props } = this
    return {
      message,
      name,
      ...props,
    }
  }

}
