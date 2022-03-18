import Echo from ".";

export default class Schema extends Echo {
  init(opts: any): void {
    super.init(opts)
    this.type = 'schema'
  }
}
