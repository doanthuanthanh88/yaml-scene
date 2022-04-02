import { IElement } from "@app/elements/IElement"
import { TraceError } from "@app/utils/error/TraceError"
import cloneDeep from "lodash.clonedeep"
import omit from "lodash.omit"

export class TemplateManager extends Map<string, IElement> {
  private static _Instance: TemplateManager | null

  static get Instance() {
    return this._Instance || (this._Instance = new TemplateManager())
  }

  reset() {
    TemplateManager._Instance = null
  }

  setElement(name: string, elem: IElement) {
    const newOne = elem.clone ? elem.clone() : cloneDeep(elem)
    return this.set(name, omit(newOne, 'proxy', '$', '$$') as IElement)
  }

  getElement(name: string) {
    const elem = super.get(name)
    if (elem) return elem.clone ? elem.clone() : cloneDeep(elem)
    throw new TraceError(`Could not found template "${name}"`)
  }

}