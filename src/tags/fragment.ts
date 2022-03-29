import { Scenario } from '@app/singleton/Scenario'
import { readFileSync } from 'fs'
import { load, Type } from 'js-yaml'
import { YAMLSchema } from '.'

/**
 * @guide
 * @name !fragment
 * @description Load scenes from another file into current file
 * @group !Tags
 * @example
- Group: 
    steps:
      - !fragment ./examples/scene_1.yas.yaml
      - Echo: Loaded scene 1 successfully

      - !fragment ./examples/scene_2.yas.yaml
      - Echo: Loaded scene 2 successfully
 * @end
 */
export class FragmentScalar extends Type {
  constructor() {
    super('!fragment', {
      kind: 'scalar',
      construct: (filePath) => {
        return load(readFileSync(Scenario.Instance.resolvePath(filePath)).toString(), {
          schema: YAMLSchema.Schema
        })
      }
    })
  }
}
