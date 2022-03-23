
export class ExtensionNotFound extends Error {
  errors: Error[]

  constructor(public extensionName: string, message: string) {
    super(message)
    this.errors = new Array()
  }
}