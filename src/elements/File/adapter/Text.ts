import { IFileAdapter } from "./IFileAdapter";

export class Text implements IFileAdapter {
  constructor(private file: IFileAdapter) { }

  async read() {
    const cnt = await this.file.read()
    return cnt.toString()
  }

  async write(data: any) {
    await this.file.write(data.toString())
  }

}