import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { createReadStream, WriteFileOptions } from 'fs';
import { readFile, writeFile } from "fs/promises";
import { IFileAdapter } from "./IFileAdapter";

export class File implements IFileAdapter {

  constructor(public path: string, public encoding?: WriteFileOptions, public readType = 'buffer' as 'stream' | 'buffer') {
    if (!path) {
      throw new TraceError(`"Path" is required`)
    }
  }

  async read() {
    if (!FileUtils.Existed(this.path)) throw new TraceError(`"${this.path}" is not valid`)
    return this.readType === 'buffer' ? readFile(this.path) : createReadStream(this.path)
  }

  async write(data: any = '') {
    FileUtils.MakeDirExisted(this.path)
    return writeFile(this.path, data, this.encoding)
  }

}
