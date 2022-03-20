import { IFileAdapter } from "./IFileAdapter";
import { readFileSync, writeFileSync } from 'fs';

export class File implements IFileAdapter {

  constructor(public path: string) {
    if (!path) {
      throw new Error(`"Path" is required`)
    }
  }

  read(): any {
    return readFileSync(this.path)
  }

  write(data = '') {
    writeFileSync(this.path, data)
  }

}