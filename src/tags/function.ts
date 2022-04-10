import { Type } from 'js-yaml'
import { Functional } from './model/Functional'

/*****
@name !function
@description Write code as a function in js
@group !Tags
@example
- Script/Js: !function |
    console.log('oldAge', age)
    await $.proxy.setVar('newAge', age + 10)
*/
export class FunctionScalar extends Type {
  constructor() {
    super('!function', {
      kind: 'scalar',
      instanceOf: Functional,
      construct: (bodyContent: string) => {
        return new Functional(bodyContent)
      }
    })
  }
}
