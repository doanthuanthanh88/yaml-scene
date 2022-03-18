import { DataModel } from "@app/utils/doc/DataModel";

const DEFAULT_ORDER = 5

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
    this.order = DEFAULT_ORDER
  }

  get description1() {
    if (!this.description) return ''
    return this.description.split('\n')[0].trim() + ' ...'
  }

  add(txt: string) {
    const m = txt.match(/(@(name|description|exampleType|example|group|order|h1|h2))((\s+(.*))||($))$/);
    let cnt = txt
    if (m && m[2]) {
      this._current = m[2];
      cnt = m[5] || ''
    }
    if (!this[this._current]) {
      this[this._current] = '';
    }
    if (typeof this[this._current] === 'number') {
      this[this._current] = +cnt;
    } else {
      this[this._current] += (this[this._current] ? '\n' : '') + cnt;
    }
  }

  get examples() {
    switch (this.exampleType) {
      case 'custom':
        return `${this.example}`
      default:
        return this.example ? `
\`\`\`${this.exampleType || 'yaml'}
${this.example}
\`\`\`
` : ''
    }
  }
}
