import { Scenario } from '@app/singleton/Scenario'
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
  constructor(_scenario: Scenario) {
    super('!function', {
      kind: 'scalar',
      construct: (bodyContent: string) => {
        return new Functional(bodyContent)
      }
    })
  }
}
