import { ElementProxy } from "../ElementProxy"

/**
 * Vars
 * @description Declare variables in scene
 * @example
- Vars:
    userA:
      name: thanh
      age: 11

- Echo: ${userA}
- Echo: ${userA.name}
 */
export default class Vars {
  proxy: ElementProxy<any>

  vars = {}

  init(props: any) {
    this.vars = props
    this.proxy.setVar(this.vars, {})
  }

  exec() {
    this.proxy.setVar(this.vars, this)
  }

  dispose() {
    this.vars = null
  }

}
