import { readFileSync, writeFileSync } from 'fs';
import { DataSource } from '../DataSource';

export class FileDataSource implements DataSource {
  constructor(public path: string) {
    if (!path) {
      throw new Error(`"Path" is required`)
    }
  }
  read(): any {
    return readFileSync(this.path)
  }
  write(data: any) {
    if (data) {
      writeFileSync(this.path, data)
    }
  }
}