import { DataSource } from "../DataSource";

export class TextDataSource implements DataSource {
  constructor(private file: DataSource) { }

  async read() {
    const cnt = await this.file.read()
    return cnt.toString()
  }

  async write(data: any) {
    await this.file.write(data.toString())
  }

}