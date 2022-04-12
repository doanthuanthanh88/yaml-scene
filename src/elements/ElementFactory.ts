import { ExtensionManager } from "@app/singleton/ExtensionManager"
import { TraceError } from "@app/utils/error/TraceError"
import cloneDeep from "lodash.clonedeep"
import { ElementProxy } from "./ElementProxy"
import { IElement } from './IElement'

/**
 * Create a new element base on name or element type
 * @class
 */
export class ElementFactory {

  /**
   * Create a new element by name
   * @param {string} name Element name
   * @param {string} dirname Directory of the element
   * @returns {Promise<ElementProxy>} A new element proxy
   */
  static async CreateElement<T extends IElement>(name: string, dirname = __dirname): Promise<ElementProxy<T>> {
    let Clazz: typeof Element
    Clazz = await ExtensionManager.Instance.load(`${name}`, dirname)
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

  /**
   * Create a new element by element type
   * @param {Class} Clazz Type of element
   * @returns {ElementProxy} A new element proxy
   */
  static CreateTheElement<T extends IElement>(Clazz: any) {
    return new ElementProxy<T>(new Clazz())
  }
}
