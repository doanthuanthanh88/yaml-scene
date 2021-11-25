import { safeDump, safeLoad } from "js-yaml";
import { DataSource } from "../DataSource";

export class YamlDataSource implements DataSource {
  constructor(private file: DataSource) { }

  async read() {
    const cnt = await this.file.read()
    const obj = await safeLoad(cnt.toString())
    return obj
  }

  async write(data: any) {
    const rs = await safeDump(data)
    await this.file.write(rs)
  }

}