import { VariableManager } from "@app/singleton/VariableManager";
import { ElementProxy } from "../ElementProxy";
import { IElement } from "../IElement";

/*****
@name Vars
@description Declare variables in scene
@example
- Vars:
    userA:
      name: thanh
      age: 11

- Echo: ${userA}
- Echo: ${userA.name}
*/
export default class Vars implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  vars: any

  init(props = {}) {
    this.vars = props
    VariableManager.Instance.declare(this.vars)
  }

  async exec() {
    await this.proxy.setVar(this.vars)
  }

  dispose() {
    this.vars = null
  }

}
