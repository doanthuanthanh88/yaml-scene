import { Scenario } from '@app/singleton/Scenario'
import { readFileSync } from 'fs'
import { safeLoad, Type } from 'js-yaml'
import { YAMLSchema } from '.'

/**
 * !fragment
 * @description Load scenes from another file into current file
 * @group Tags
 * @example
- Group: 
    steps:
      - !fragment ./examples/scene_1.yaml
      - Echo: Loaded scene 1 successfully

      - !fragment ./examples/scene_2.yaml
      - Echo: Loaded scene 2 successfully
 */
export class FragmentScalar extends Type {
  constructor(scenario: Scenario) {
    super('!fragment', {
      kind: 'scalar',
      construct: (filePath) => {
        return safeLoad(readFileSync(scenario.resolvePath(filePath)).toString(), {
          schema: YAMLSchema.Create(scenario)
        })
      }
    })
  }
}
