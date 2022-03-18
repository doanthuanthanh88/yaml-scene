import { ElementProxy } from "../ElementProxy"

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
