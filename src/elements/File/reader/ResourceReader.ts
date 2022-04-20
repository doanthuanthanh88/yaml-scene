import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { FileReader } from "./FileReader";
import { IFileReader } from "./IFileReader";
import { UrlReader } from "./UrlReader";

export class ResourceReader implements IFileReader {
  static readonly Initable = true
  private existed: boolean | 'url'
  private reader: IFileReader

  get isFile() {
    return this.existed === true
  }

  constructor(public path: string, public config = {} as { readType?: 'stream' | 'buffer' }) {
    this.existed = FileUtils.Existed(this.path)
    if (!this.existed) throw new TraceError(`"${this.path}" is not valid`)

    this.reader = this.existed === 'url' ? new UrlReader(this.path, this.config) : new FileReader(this.path, this.config)
  }

  async read() {
    const data = await this.reader.read()
    return data
  }

}
