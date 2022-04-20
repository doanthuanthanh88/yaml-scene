import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { WriteFileOptions } from "fs";
import { FileWriter } from "./FileWriter";
import { IFileWriter } from "./IFileWriter";

export class ResourceWriter implements IFileWriter {
  static readonly Initable = true
  private existed: boolean | 'url'
  private writer: IFileWriter

  get isFile() {
    return this.existed === true
  }

  constructor(public path: string, public config = {} as { encoding?: WriteFileOptions, readType?: 'stream' | 'buffer' }) {
    this.existed = FileUtils.Existed(this.path)
    if (this.existed === 'url') throw new TraceError(`"${this.path}" is not supported to write`)
    this.writer = new FileWriter(this.path, this.config)
  }

  async write(data: any) {
    await this.writer.write(data)
  }

}
