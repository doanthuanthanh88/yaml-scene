import chalk from "chalk"
import { ElementProxy } from "../ElementProxy"
import { IElement } from "../IElement"

/**
 * Echo
 * @description Print data to screen
 * @example
- Echo: Hello world
- Echo~green: Green text
- Echo~blue: Blue text
- Echo~red: Red text
- Echo~yellow: Yellow text
- Echo~cyan: Cyan text

- Vars:
    user:
      name: thanh
      lang: vi

- Echo.schema: ${user}
 */
export class Echo implements IElement {
  proxy: ElementProxy<any>

  message: string
  color?: string

  init(message: string) {
    this.message = message
  }

  format(txt: string) {
    // txt = (txt && typeof txt === 'object') ? JSON.stringify(txt, null, '  ') : txt
    if (!this.color) return txt
    return chalk[this.color](txt)
  }

  exec() {
    const message = this.proxy.getVar(this.message)
    this.proxy.logger.info(this.format(message))
  }

}