import { IFileAdapter } from "./IFileAdapter";
import { Builder, parseStringPromise } from 'xml2js';

export class Xml implements IFileAdapter {
  constructor(private file: IFileAdapter) { }

  async read() {
    const cnt = await this.file.read()
    const obj = await parseStringPromise(cnt.toString())
    return obj
  }

  async write(data: any) {
    const rs = await new Builder().buildObject(data)
    await this.file.write(rs)
  }

}