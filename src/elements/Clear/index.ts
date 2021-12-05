import { IElement } from "../IElement"

export class Clear implements IElement {

  exec() {
    console.clear()
  }

  clone() {
    return this
  }
}