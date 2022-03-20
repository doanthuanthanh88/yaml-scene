import { IFileAdapter } from "./IFileAdapter";
import { safeDump, safeLoad } from "js-yaml";

export class Yaml implements IFileAdapter {
  constructor(private file: IFileAdapter) { }

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