import { DataModel } from "@app/utils/doc/DataModel";

export class CommentInfo implements DataModel {
  name: string;
  description?: string;
  example?: string;
  exampleType?: string
  group: string;
  order?: number;
  h1?: string
  h2?: string

  _current = 'name';

  constructor() {
    this.order = 5
  }

  add(txt: string) {
    const m = txt.match(/^(\@(\w+)\s?)?(.*)/);
    if (m) {
      if (m[2]) {
        this._current = m[2];
      }
      if (!this[this._current]) {
        this[this._current] = '';
      } else {
        if (typeof this[this._current] !== 'number') {
          this[this._current] += '\n';
        }
      }
      if (typeof this[this._current] === 'number') {
        this[this._current] = +m[3];
      } else {
        this[this._current] += m[3];
      }
    }

  }

  get examples() {
    switch (this.exampleType) {
      case 'custom':
        return `${this.example}`
      default:
        return `
\`\`\`${this.exampleType || 'yaml'}
${this.example}
\`\`\`
`
    }
  }
}