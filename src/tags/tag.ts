import { ElementFactory } from '@app/elements/ElementFactory'
import { ElementProxy } from '@app/elements/ElementProxy'
import { Type } from 'js-yaml'

/**
 * @guide
 * @name !tag
 * @description Lazy load tag
 * @group !Tags
 * @example
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file: !tag 
        tags/binary: ~/data.json
 * @end
 */
export class TagMapping extends Type {
  constructor() {
    super('!tag', {
      kind: 'mapping',
      instanceOf: ElementProxy,
      construct: (props) => {
        const key = Object.keys(props)[0]
        const proxy = ElementFactory.CreateElement(key)
        proxy.init(props[key])
        return proxy
      }
    })
  }
}
