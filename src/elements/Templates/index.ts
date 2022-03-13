import { IElement } from "../IElement";
import { ElementFactory } from "../ElementFactory";
import { ElementProxy } from "../ElementProxy";
import { Group } from "../Group";

/**
 * Templates
 * @description Declare elements which not `inited` or `run`  
 * It's only used for `extends` or `inherit` purposes
 * @example
- Templates:
    - Get:
        ->: base    # Declare a template with name is "base"
        baseURL: http://localhost

- Get:
    <-: base        # Extends "base" in template then add more information or overrided them before executing
    url: /product/:id
    params:
      id: 1
 */
export class Templates {
  proxy: ElementProxy<Templates>

  group: ElementProxy<Group>

  init(items: IElement[]) {
    this.group = ElementFactory.CreateElement<Group>('Group', this.proxy.scenario)
    this.group.init({
      steps: items
    })
    this.group.element.handleInheritExpose()
  }

  async dispose() {
    await this.group.dispose()
  }

}