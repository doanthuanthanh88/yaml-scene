import { Type } from 'js-yaml'
import { Functional } from './model/Functional'

/**
 * @guide
 * @name !function
 * @description Write code as a function in js
 * @group !Tags
 * @example
- Script/Js: !function |
    console.log('oldAge', age)
    $.proxy.setVar('newAge', age + 10)
 * @end
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
