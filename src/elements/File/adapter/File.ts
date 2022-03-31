import { TraceError } from "@app/utils/error/TraceError";
import { readFileSync, WriteFileOptions, writeFileSync } from 'fs';
import { IFileAdapter } from "./IFileAdapter";

export class FileBinary {
  constructor(public data: any) { }
}

export class File implements IFileAdapter {

  constructor(public path: string, public encoding?: WriteFileOptions) {
    if (!path) {
      throw new TraceError(`"Path" is required`)
    }
  }

  read(): any {
    return readFileSync(this.path)
  }

  write(data: any = '') {
    writeFileSync(this.path, data, this.encoding)
  }

}
