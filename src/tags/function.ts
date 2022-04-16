import { Type } from 'js-yaml'
import { Functional } from './model/Functional'

/*****
@name !function
@description Write code as a function in js
@group !Tags
@example
- Vars:
    globalVar1: Global variable 01
    
- Script/Js: !function |
    ({ globalVar1, $ }) {                           # Load global variables into function
                                                    # "$" always is the current element. In this example, "$" = Script/Js element
      console.log('oldAge', age)
      await this.proxy.setVar('newAge', age + 10)
    }
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
