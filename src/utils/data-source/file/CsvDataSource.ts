import stringify from 'csv-stringify/lib/sync'
import parser from 'csv-parse/lib/sync'
import { DataSource } from "../DataSource";

export class CsvDataSource implements DataSource {
  constructor(private file: DataSource) { }

  async read() {
    const cnt = await this.file.read()
    const obj = await parser(cnt.toString())
    return obj
  }

  async write(data: any) {
    const rs = await stringify(data)
    await this.file.write(rs)
  }

}