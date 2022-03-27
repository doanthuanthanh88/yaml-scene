import { IFileAdapter } from "./IFileAdapter";

export class Buf implements IFileAdapter {

  constructor(public data: Buffer) {

  }

  read(): any {
    return this.data
  }

  write(data: Buffer) {
    return this.data = Buffer.concat([this.data, data])
  }

}