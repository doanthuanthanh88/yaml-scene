import { IFileAdapter } from "./IFileAdapter";
import stringify from 'csv-stringify/lib/sync'
import parse from 'csv-parse/lib/sync'

export class Csv implements IFileAdapter {
  constructor(private file: IFileAdapter) { }

  async read() {
    const cnt = await this.file.read()
    const obj = await parse(cnt.toString())
    return obj
  }

  async write(data: any) {
    const rs = await stringify(data)
    await this.file.write(rs)
  }

}