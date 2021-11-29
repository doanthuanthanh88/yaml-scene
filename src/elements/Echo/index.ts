import { ElementProxy } from "../ElementProxy"

export class Echo {
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