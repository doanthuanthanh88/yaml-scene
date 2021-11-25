import { createReadStream, ReadStream } from 'fs'
import { Type } from 'js-yaml'

export const binary = new Type('!binary', {
  kind: 'scalar',
  instanceOf: ReadStream,
  construct: (data) => {
    const file = data
    return createReadStream(file)
  }
})
