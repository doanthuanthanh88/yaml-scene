import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { createReadStream, WriteFileOptions } from 'fs';
import { readFile, writeFile } from "fs/promises";
import merge from "lodash.merge";
import { IFileAdapter } from "./IFileAdapter";

export class File implements IFileAdapter {

  constructor(public path: string, public config = {} as { encoding?: WriteFileOptions, readType?: 'stream' | 'buffer' }) {
    if (!path) {
      throw new TraceError(`"Path" is required`)
    }
    this.config = merge({ readType: 'buffer' }, this.config)
  }

  async read() {
    if (!FileUtils.Existed(this.path)) throw new TraceError(`"${this.path}" is not valid`)
    switch (this.config.readType) {
      case 'buffer':
        return readFile(this.path)
      case 'stream':
        return createReadStream(this.path)
      default:
        throw new TraceError(`Adapter "File" is not support "readType" is "${this.config.readType}"`)
    }
  }

  async write(data: any = '') {
    FileUtils.MakeDirExisted(this.path)
    return writeFile(this.path, data, this.config.encoding)
  }

}
