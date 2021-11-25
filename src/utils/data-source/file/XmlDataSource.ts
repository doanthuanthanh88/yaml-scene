import { Builder, parseStringPromise } from 'xml2js';
import { DataSource } from "../DataSource";

export class XmlDataSource implements DataSource {
  constructor(private file: DataSource) { }

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