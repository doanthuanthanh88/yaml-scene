import { IElement } from "../IElement";
import { ElementFactory } from "../ElementFactory";
import { ElementProxy } from "../ElementProxy";
import Group from "../Group";

/**
 * @guide
 * @name Templates
 * @description Declare elements which not `inited` or `run`  
It's only used for `extends` or `inherit` purposes
 * @example
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
 * @end
 */
export default class Templates {
  proxy: ElementProxy<Templates>

  group: ElementProxy<Group>

  init(items = [] as { [name: string]: IElement } | IElement[]) {
    const templates = Array.isArray(items) ? items : Object.keys(items).map(templateName => {
      const elementName = Object.keys(items[templateName])[0]
      items[templateName][elementName]['->'] = templateName
      return items[templateName]
    })
    this.group = ElementFactory.CreateElement<Group>('Group', this.proxy.scenario)
    this.group.init({
      steps: templates
    })
  }

  async dispose() {
    await this.group.dispose()
  }

}