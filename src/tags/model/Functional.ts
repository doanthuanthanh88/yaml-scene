import { StringUtils } from "@app/utils/StringUtils"

export class Functional {
  private static readonly _PreloadVarPattern = /^\(\s*\{[a-zA-Z0-9_$,\s]+\}\s*\)$/

  static GetFunction(body: any) {
    if (body instanceof Functional) return body
    if (typeof body === 'string') return new Functional(body)
    return undefined
  }

  constructor(public body: string) { }

  toString() {
    return this.body
  }

  toReturn() {
    const [firstLine, others] = StringUtils.Split2(this.body, '\n')
    if (firstLine && Functional._PreloadVarPattern.test(firstLine)) {
      return `${firstLine}\nreturn ${others}`
    }
    return `return ${this.body}`
  }
}