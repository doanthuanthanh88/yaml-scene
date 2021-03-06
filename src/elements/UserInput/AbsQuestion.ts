import merge from 'lodash.merge';
import { stdin } from 'process';
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
  opts: any

  get config() {
    const { title: message, var: name, opts, default: initial, ...props } = this
    return {
      initial,
      message,
      name,
      ...props,
    }
  }

  constructor(config: any) {
    merge(this, config)
    if (!this.opts) this.opts = {}
    if (!this.opts.onCancel) {
      this.opts.onCancel = () => process.exit(0)
    }
  }

  async prepare(proxy: ElementProxy<any>) {
    await proxy.applyVars(this, 'title', 'required', 'pattern', 'default')
  }

  async exec() {
    const varName = this.var || `varName${Math.random()}`
    let response: prompts.Answers<any>
    let vl: any
    do {
      response = await prompts(this.config, this.opts)
      vl = response[varName]
    } while (this.required && (vl === undefined || vl === null || vl === '' || Number.isNaN(vl)))
    return response
  }

  sendKey(opts = { key: '\r', name: 'return' }, sin = stdin) {
    sin.emit('keypress', opts.key, {
      name: opts.name
    })
  }

  dispose() { }

}
