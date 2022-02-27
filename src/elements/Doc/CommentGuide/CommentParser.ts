import { DataParser } from '@app/utils/doc/DataParser';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import { CommentInfo } from './CommentInfo';

export class CommentParser implements DataParser {
  private infos = [];
  private info: CommentInfo;

  constructor(public file: string) {
  }

  parse() {
    return new Promise<CommentInfo[]>((resolve, reject) => {
      const rl = createInterface({ input: createReadStream(this.file) });
      rl.on('line', (txt) => {
        this.onEachLine(txt);
      });
      rl.on('error', reject);
      rl.on('close', () => {
        resolve(this.infos);
      });
    });
  }

  private onEachLine(txt: string) {
    if (!this.info) {
      if (/^\s*\/\*\*\s*$/.test(txt)) {
        this.info = new CommentInfo();
      }
    } else {
      if (/^\s*\*\/\s*$/.test(txt)) {
        this.infos.push(this.info);
        this.info = null;
      } else {
        txt = txt.replace(/^\s*\*\s*/g, '');
        this.info.add(txt);
      }
    }
  }
}
