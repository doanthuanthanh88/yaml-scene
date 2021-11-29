import { Element } from "../Element";
import { ElementFactory } from "../ElementFactory";
import { ElementProxy } from "../ElementProxy";
import { Group } from "../Group";

export class Templates {
  proxy: ElementProxy<Templates>

  group: ElementProxy<Group>

  init(items: Element[]) {
    this.group = ElementFactory.CreateElement<Group>('Group', this.proxy.tc)
    this.group.init({
      steps: items
    })
    this.group.element.handleInheritExpose()
  }

  async dispose() {
    await this.group.dispose()
  }

}