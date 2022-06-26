import { DataModel } from '@app/utils/doc/DataModel';
import { DataParser } from '@app/utils/doc/DataParser';
import { Exporter } from '@app/utils/doc/Exporter';
import { Scanner as IScanner } from '@app/utils/doc/Scanner';
import { statSync } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { EventEmitter } from 'stream';
import { ScannerEvent } from './ScannerEvent';

export class Scanner implements IScanner {

  event: EventEmitter

  constructor(public exporter: Exporter<DataModel>, public ParserClass: new (...args: any[]) => DataParser) {
    this.event = new EventEmitter()
  }

  async scanDir(dir: string, excludes?: string[], includePattern?: RegExp, beginPattern?: string, endPattern?: string) {
    const names = await readdir(dir);
    const parsers = await Promise.all<DataParser[]>(names.map(async (name) => {
      const path = join(dir, name);
      const st = statSync(path);

      if (st.isDirectory()) {
        if (!excludes?.find(ex => path.startsWith(ex))) {
          const commentModels = await this.scanDir(path, excludes, includePattern, beginPattern, endPattern);
          return commentModels
        }
      }

      if (st.isFile() && includePattern?.test(name)) {
        this.event.emit(ScannerEvent.SCAN_FILE, path)
        const commentModel = await new this.ParserClass(path, beginPattern, endPattern)
        return [commentModel]
      }

      return [] as DataParser[]
    })) as DataParser[][]
    return parsers.flat()
  }
}
