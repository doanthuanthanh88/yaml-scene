import { IElement } from "@app/elements/IElement"
import cloneDeep from "lodash.clonedeep"

export class TemplateManager extends Map<string, IElement> {

  setElement(name: string, elem: IElement) {
    return this.set(name, elem)
  }

  getElement(name: string) {
    const elem = super.get(name)
    if (elem) return elem.clone ? elem.clone() : cloneDeep(elem)
    throw new Error(`Could not found template "${name}"`)
  }

}