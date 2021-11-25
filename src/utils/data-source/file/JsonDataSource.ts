import { DataSource } from "../DataSource";

export class JsonDataSource implements DataSource {
  constructor(private file: DataSource) { }

  async read() {
    const cnt = await this.file.read()
    const obj = await JSON.parse(cnt.toString())
    return obj
  }

  async write(data: any) {
    const rs = await JSON.stringify(data)
    await this.file.write(rs)
  }

}