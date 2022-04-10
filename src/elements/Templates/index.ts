import { ElementFactory } from "../ElementFactory";
import { ElementProxy } from "../ElementProxy";
import { IElement } from "../IElement";

/*****
@name Templates
@description Declare elements which not `inited` or `run`  
It's only used for `extends` or `inherit` purposes
@example
- Templates:
    - Get:
        ->: base1    # Declare a template with name is "base"
        baseURL: http://localhost:3001

- Templates:
    base2: # Declare a template with name is "base"
      Get:
        baseURL: http://localhost:3000

- Get:
    <-: base1        # Extends "base1" in template then add more information or overrided them before executing
    url: /product/:id
    params:
      id: 1

- Get:
    <-: base2        # Extends "base2" in template then add more information or overrided them before executing
    url: /product/:id
    params:
      id: 2
*/
export default class Templates implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  init(items = [] as { [name: string]: any } | any[]) {
    const steps = Array.isArray(items) ? items : Object.keys(items).map(templateName => {
      const elementName = Object.keys(items[templateName])[0]
      items[templateName][elementName]['->'] = templateName
      return items[templateName]
    })
    steps.flat(Number.MAX_SAFE_INTEGER).forEach(step => {
      const name = Object.keys(step)[0]
      const elem = ElementFactory.CreateElement<IElement>(name)
      elem.init(step[name])
    })
  }

  clone() {
    return this
  }

}