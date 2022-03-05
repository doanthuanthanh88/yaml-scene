import { createReadStream, ReadStream } from 'fs'
import { Type } from 'js-yaml'

/**
 * !binary
 * @description Transform file to binary
 * @group Tags
 * @example
- Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file: !binary ~/data.json
 */
export const binary = new Type('!binary', {
  kind: 'scalar',
  instanceOf: ReadStream,
  construct: (data) => {
    const file = data
    return createReadStream(file)
  }
})
