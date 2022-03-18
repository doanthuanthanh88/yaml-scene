import { IElement } from "../IElement"

/**
 * Clear
 * @description Clear screen
 * @group Output
 * @example
 - Clear:
 */
export default class Clear implements IElement {

  exec() {
    console.clear()
  }

  clone() {
    return this
  }
}