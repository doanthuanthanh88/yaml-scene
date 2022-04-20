import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { createReadStream } from 'fs';
import { readFile } from "fs/promises";
import merge from "lodash.merge";
import { IFileReader } from "./IFileReader";

export class FileReader implements IFileReader {
  static readonly Initable = true

  constructor(public path: string, public config = {} as { readType?: 'stream' | 'buffer' }) {
    if (!FileUtils.Existed(this.path)) throw new TraceError(`"${this.path}" is not valid`)
    this.config = merge({ readType: 'buffer' }, this.config)
  }

  async read() {
    switch (this.config.readType) {
      case 'buffer':
        return readFile(this.path)
      case 'stream':
        return createReadStream(this.path)
      default:
        throw new TraceError(`Adapter "File" is not support "readType" is "${this.config.readType}"`)
    }
  }

}
