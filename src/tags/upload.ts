import { Scenario } from '@app/singleton/Scenario'
import { createReadStream, ReadStream } from 'fs'
import { Type } from 'js-yaml'

/**
 * @guide
 * @name !binary
 * @description Transform file to binary
 * @group !Tags
 * @example
- Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file: !binary ~/data.json
 * @end
 */
export class BinaryScalar extends Type {
  constructor(scenario: Scenario) {
    super('!binary', {
      kind: 'scalar',
      instanceOf: ReadStream,
      construct: (file) => {
        return createReadStream(scenario.resolvePath(file))
      }
    })
  }
}
