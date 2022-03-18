import { Scenario } from "@app/singleton/Scenario"
import cloneDeep from "lodash.clonedeep"
import { ElementProxy } from "./ElementProxy"
import { IElement } from './IElement'

export class ElementFactory {

  static CreateElement<T extends IElement>(name: string, scenario: Scenario) {
    let Clazz: typeof Element
    try {
      Clazz = require(`./${name}`).default
      if (!Clazz) throw new Error(`Could not found "${name}"`)
    } catch (err1) {
      try {
        // yarn-grpc/Server
        Clazz = scenario.extensions.getGlobalExtension(name)
        if (!Clazz) {
          Clazz = scenario.extensions.load(`${name}`)
        }
        if (!Clazz) throw err1
      } catch (err2) {
        throw new Error('\nError1: ' + err1.message + '\nError2: ' + err2.message)
      }
    }
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
