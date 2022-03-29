import { TraceError } from "./TraceError"

export class ExtensionNotFound extends TraceError {
  errors: Error[]

  constructor(public extensionName: string, message: string) {
    super(message)
    this.name = 'ExtensionNotFound'
    this.errors = new Array()
  }
}