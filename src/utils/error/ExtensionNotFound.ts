
export class ExtensionNotFound extends Error {

  public localPath: string

  constructor(public extensionName: string, message: string, public scope?: 'local' | 'global') {
    super(message)
    this.name = 'ExtensionNotFound'
  }
}