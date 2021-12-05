import { IElement } from "../IElement";
import { ElementFactory } from "../ElementFactory";
import { ElementProxy } from "../ElementProxy";
import { Group } from "../Group";

export class Templates {
  proxy: ElementProxy<Templates>

  group: ElementProxy<Group>

  init(items: IElement[]) {
    this.group = ElementFactory.CreateElement<Group>('Group')
    this.group.init({
      steps: items
    })
    this.group.element.handleInheritExpose()
  }

  async dispose() {
    await this.group.dispose()
  }

}