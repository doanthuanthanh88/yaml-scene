
export class Functional {

  static GetFuntion(body: any) {
    if (body instanceof Functional) return body
    if (typeof body === 'string') return new Functional(body)
    return undefined
  }

  constructor(public body: string) { }

  toString() {
    return this.body
  }

  toReturn() {
    return `return ${this.body}`
  }
}