import { ElementProxy } from "../ElementProxy";
import { IElement } from "../IElement";

/**
 * @guide
 * @name Clear
 * @description Clear screen
 * @group Output
 * @example
- Clear:
 * @end
 */
export default class Clear implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  exec() {
    console.clear()
  }

  clone() {
    return this
  }
}