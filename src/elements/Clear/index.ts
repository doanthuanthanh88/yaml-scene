import { IElement } from "../IElement"

/**
 * Clear
 * @description Clear screen
 * @example
 - Clear:
 */
export class Clear implements IElement {

  exec() {
    console.clear()
  }

  clone() {
    return this
  }
}