import { Echo } from ".";

export class Schema extends Echo {
  init(opts: any): void {
    super.init(opts)
    this.type = 'schema'
  }
}
