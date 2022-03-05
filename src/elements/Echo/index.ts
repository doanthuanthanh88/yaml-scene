import { ElementProxy } from "../ElementProxy"
import { IElement } from "../IElement"

/**
 * Echo
 * @description Print data to screen
 * @example
- Echo: Hello world
- Echo: ${msg}
 */
export class Echo implements IElement {
  proxy: ElementProxy<any>

  message: string

  init(message: string) {
    this.message = message
  }

  exec() {
    const message = this.proxy.getVar(this.message)
    this.proxy.logger.info((message && typeof message === 'object') ? JSON.stringify(message, null, '  ') : message)
  }

}