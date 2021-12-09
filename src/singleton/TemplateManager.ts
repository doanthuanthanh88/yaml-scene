import { IElement } from "@app/elements/IElement"
import { cloneDeep } from "lodash"

export class TemplateManager extends Map<string, IElement> {
  private static _Instance: TemplateManager

  static get Elements() {
    return TemplateManager._Instance || (TemplateManager._Instance = new TemplateManager())
  }

  set(name: string, elem: IElement) {
    const newOne = elem.clone ? elem.clone() : cloneDeep(elem)
    newOne.proxy = null
    return super.set(name, newOne)
  }

  get(name: string) {
    const rs = super.get(name)
    if (rs) return rs
    throw new Error(`Could not found template "${name}"`)
  }

}