import { ElementProxy } from "../ElementProxy";

/**
 * Script~Js
 * @description Embed javascript code into scene
 * @example
- Vars:
    name: 10

- Script~Js: |
    console.log('oldValue', name)
    _.proxy.setVar('newName', name + 10)

- Echo: New value ${newName}
 */
export class Js {
  proxy: ElementProxy<any>
  content: string

  init(content: string) {
    this.content = content
  }

  async exec() {
    const rs = await this.proxy.eval(this.content)
    return rs
  }

}