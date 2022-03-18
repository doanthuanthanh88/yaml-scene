import { IElement } from "../IElement"

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

  exec() {
    console.clear()
  }

  clone() {
    return this
  }
}