import { ElementProxy } from "../ElementProxy";

export class js {
  proxy: ElementProxy<any>
  content: string

  init(content: string) {
    this.content = content
  }

  async exec() {
    await this.proxy.eval(this.content)
  }

}