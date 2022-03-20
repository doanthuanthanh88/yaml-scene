import { Scenario } from "@app/singleton/Scenario"
import cloneDeep from "lodash.clonedeep"
import { ElementProxy } from "./ElementProxy"
import { IElement } from './IElement'

export class ElementFactory {

  static CreateElement<T extends IElement>(name: string, scenario: Scenario) {
    let Clazz: typeof Element
    Clazz = scenario.extensions.load(`${name}`, __dirname)
    if (!Clazz) throw new Error(`Could not found "${name}"`)
    let tag: any
    if (Clazz.prototype) {
      tag = new Clazz()
    } else {
      tag = Clazz
      tag = tag.clone ? tag.clone() : cloneDeep(tag)
    }
    return new ElementProxy<T>(tag, scenario)
  }
}
