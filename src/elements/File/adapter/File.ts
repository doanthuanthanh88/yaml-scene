import { TraceError } from "@app/utils/error/TraceError";
import { readFileSync, writeFileSync } from 'fs';
import { IFileAdapter } from "./IFileAdapter";

export class File implements IFileAdapter {

  constructor(public path: string) {
    if (!path) {
      throw new TraceError(`"Path" is required`)
    }
  }

  read(): any {
    return readFileSync(this.path)
  }

  write(data = '') {
    writeFileSync(this.path, data)
  }

}