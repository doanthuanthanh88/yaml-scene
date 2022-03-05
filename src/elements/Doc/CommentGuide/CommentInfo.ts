import { DataModel } from "@app/utils/doc/DataModel";

export class CommentInfo implements DataModel {
  name: string;
  description?: string;
  example?: string;
  group: string;
  order?: number;

  _current = 'name';

  add(txt: string) {
    const m = txt.match(/^(\@(\w+)\s?)?(.*)/);
    if (m) {
      if (m[2]) {
        this._current = m[2];
      }
      if (!this[this._current]) {
        this[this._current] = '';
      } else {
        this[this._current] += '\n';
      }
      this[this._current] += m[3];
    }

  }
}
