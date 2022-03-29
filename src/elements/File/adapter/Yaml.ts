import { IFileAdapter } from "./IFileAdapter";
import { dump, load } from "js-yaml";

export class Yaml implements IFileAdapter {
  constructor(private file: IFileAdapter) { }

  async read() {
    const cnt = await this.file.read()
    const obj = await load(cnt.toString())
    return obj
  }

  async write(data: any) {
    const rs = await dump(data)
    await this.file.write(rs)
  }

}