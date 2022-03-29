import { IElement } from "@app/elements/IElement"
import cloneDeep from "lodash.clonedeep"
import omit from "lodash.omit"

export class TemplateManager extends Map<string, IElement> {
  private static _Instance: TemplateManager

  static get Instance() {
    return this._Instance || (this._Instance = new TemplateManager())
  }

  reset() {
    TemplateManager._Instance = null
  }

  setElement(name: string, elem: IElement) {
    const newOne = elem.clone ? elem.clone() : cloneDeep(elem)
    return this.set(name, omit(newOne, 'proxy', '$', '$$'))
  }

  getElement(name: string) {
    const elem = super.get(name)
    if (elem) return elem.clone ? elem.clone() : cloneDeep(elem)
    throw new Error(`Could not found template "${name}"`)
  }

}