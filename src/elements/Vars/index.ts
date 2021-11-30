import { ElementProxy } from "../ElementProxy"

export class Vars {
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
