import { stdin } from 'process';
import prompts from 'prompts';
import { Writable } from 'stream';
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
  opts: any
  stdout: Writable

  get config() {
    const { title: message, var: name, opts, default: initial, ...props } = this
    return {
      initial,
      message,
      name,
      ...props,
    }
  }

  constructor({ title, required, pattern, var: varName, default: df, format, opts }: any) {
    this.title = title
    this.required = required
    this.pattern = pattern
    this.var = varName
    this.default = df
    this.format = format
    this.opts = opts
  }

  async prepare(proxy: ElementProxy<any>) {
    this.title = await proxy.getVar(this.title)
    this.required = await proxy.getVar(this.required)
    this.pattern = await proxy.getVar(this.pattern)
    this.var = await proxy.getVar(this.var)
    this.default = await proxy.getVar(this.default)
  }

  async exec() {
    if (!this.var) {
      this.var = `rd${Math.random()}`
    }
    const response = await prompts(this.config, this.opts)
    return response[this.var]
  }

  sendKey(opts = { key: '\r', name: 'return' }, sin = stdin) {
    sin.emit('keypress', opts.key, {
      name: opts.name
    })
  }

  dispose() { }

}
