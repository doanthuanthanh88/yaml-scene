import { DataModel } from '@app/utils/doc/DataModel';
import { DataParser } from '@app/utils/doc/DataParser';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

export abstract class ContentParser<T extends DataModel> implements DataParser {
  protected infos = [];

  constructor(public file: string) {
  }

  parse() {
    return new Promise<T[]>((resolve, reject) => {
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

  abstract onEachLine(txt: string)
}
