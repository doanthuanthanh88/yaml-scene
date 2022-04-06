import { ExtensionManager } from "@app/singleton/ExtensionManager"
import { TraceError } from "@app/utils/error/TraceError"
import cloneDeep from "lodash.clonedeep"
import { ElementProxy } from "./ElementProxy"
import { IElement } from './IElement'

export class ElementFactory {

  static CreateElement<T extends IElement>(name: string, dirname = __dirname) {
    let Clazz: typeof Element
    Clazz = ExtensionManager.Instance.load(`${name}`, dirname)
    if (!Clazz) throw new TraceError(`Could not found "${name}"`)
    let tag: any
    if (Clazz.prototype) {
      tag = new Clazz()
    } else {
      tag = Clazz
      tag = tag.clone ? tag.clone() : cloneDeep(tag)
    }
    return new ElementProxy<T>(tag)
  }
}
