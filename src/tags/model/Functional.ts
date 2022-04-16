import { TraceError } from "@app/utils/error/TraceError"

export class Functional {
  // private static readonly _PreloadVarPattern = /^(\(\s*\{[a-zA-Z0-9_$,\s]+\}\s*\))$/
  // private static readonly _PreloadFuncPattern = /^(\(\s*\{[a-zA-Z0-9_$,\s]+\}\s*\)\s*\{\s*)$/

  static GetFunction(body: any) {
    if (body instanceof Functional) return body
    if (typeof body === 'string') return new Functional(body)
    return undefined
  }

  constructor(public body: string) {
    this.body = this.body.replace(/^\s*\/\/.+\n*/m, '').trim()
  }

  getFunctionFromBody(): Function {
    const [firstLine] = this.body.split('\n', 1)
    let vl: Function
    try {
      if (firstLine && firstLine.startsWith('(')) {
        eval(`vl = async function ${this.body}`)
      } else {
        eval(`vl = async function(...args) {
  ${this.body}
}`)
      }
    } catch (err) {
      throw new TraceError(`Function wrong format`, { err })
    }
    return vl
  }

  toString() {
    return this.body
  }

  // toReturnString() {
  //   return 'return ' + this.toString()
  // }

  // toReturn() {
  //   const [firstLine, others] = StringUtils.Split2(this.body, '\n')
  //   if (firstLine && Functional._PreloadVarPattern.test(firstLine)) {
  //     return `${firstLine}\nreturn ${others}`
  //   }
  //   return `return ${this.body}`
  // }

  // toReturnFunction() {
  //   return 'return ' + this.body.replace(new RegExp(Functional._PreloadVarPattern, 'm'), 'function $1 {\n') + '\n}';
  // }
}