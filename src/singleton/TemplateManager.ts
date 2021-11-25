import { Element } from "@app/elements/Element"
import { cloneDeep } from "lodash"

export class TemplateManager {
  private static _Instance: TemplateManager

  static get Instance() {
    return TemplateManager._Instance || (TemplateManager._Instance = new TemplateManager())
  }

  private _elements = {} as { [name: string]: Element }

  register(name: string, elem: Element) {
    this._elements[name] = elem.clone ? elem.clone() : cloneDeep(elem)
    this._elements[name]['proxy'] = null
  }

  get(name: string) {
    const rs = this._elements[name]
    if (rs) return rs
    throw new Error(`Could not found template "${name}"`)
  }

}