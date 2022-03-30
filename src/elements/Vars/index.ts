import { VariableManager } from "@app/singleton/VariableManager"
import { ElementProxy } from "../ElementProxy"
import { IElement } from "../IElement"

/**
 * @guide
 * @name Vars
 * @description Declare variables in scene
 * @example
- Vars:
    userA:
      name: thanh
      age: 11

- Echo: ${userA}
- Echo: ${userA.name}
 * @end
 */
export default class Vars implements IElement {
  proxy: ElementProxy<any>

  vars = {}

  init(props: any) {
    this.vars = props
    VariableManager.Instance.declare(this.vars)
  }

  async exec() {
    debugger
    await this.proxy.setVar(this.vars)
  }

  dispose() {
    this.vars = null
  }

}
