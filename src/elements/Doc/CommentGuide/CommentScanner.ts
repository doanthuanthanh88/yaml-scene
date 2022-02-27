import { DataParser } from '@app/utils/doc/DataParser';
import { Exporter } from '@app/utils/doc/Exporter';
import { Scanner } from '@app/utils/doc/Scanner';
import { statSync } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { EventEmitter } from 'stream';

export class CommentScanner implements Scanner {

  event: EventEmitter

  constructor(public exporter: Exporter, public ParserClass: new (...args) => DataParser) {
    this.event = new EventEmitter()
  }

  async scanDir(dir: string, excludes?: string[], includePattern?: RegExp) {
    const names = await readdir(dir);
    const parsers = await Promise.all<DataParser[]>(names.map(async (name) => {
      const path = join(dir, name);
      const st = statSync(path);

      if (st.isDirectory()) {
        if (!excludes?.find(ex => path.startsWith(ex))) {
          const commentModels = await this.scanDir(path, excludes, includePattern);
          return commentModels
        }
      }

      if (st.isFile() && includePattern?.test(name)) {
        this.event.emit('scanfile', path)
        const commentModel = await new this.ParserClass(path)
        return [commentModel]
      }

      return [] as DataParser[]
    })) as DataParser[][]
    return parsers.flat()
  }
}
