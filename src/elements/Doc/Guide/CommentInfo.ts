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
    return this.description.split('\n', 1)[0].trim() + ' ...'
  }

  add(txt: string) {
    const m = txt.match(/(@(name|description|exampleType|example|group|order|h1|h2))((\s+(.*))||($))$/);
    let cnt = txt
    let isTagWithName: boolean = false
    if (m && m[2]) {
      this._current = m[2];
      cnt = m[5] || ''
      isTagWithName = true
    }
    if (!this[this._current]) {
      this[this._current] = '';
    } else if (isTagWithName) {
      if (!this[this._current + '_s']) this[this._current + '_s'] = []
      this[this._current + '_s'].push(this[this._current])
      this[this._current] = ''
    }
    if (typeof this[this._current] === 'number') {
      this[this._current] = +(cnt?.trim());
    } else {
      this[this._current] += (this[this._current] ? '\n' : '') + (isTagWithName ? cnt?.trim() : cnt?.replace(/\s+$/g, ''))
    }
  }

  get examples() {
    const examples = this['example_s'] || []
    return [...examples, this.example].filter(e => !!e).map(example => {
      if (this.exampleType === 'custom')
        return `${example}`
      return example ? `
\`\`\`${this.exampleType || 'yaml'}
${example}
\`\`\`
` : ''
    }).join('\n')
  }
}
