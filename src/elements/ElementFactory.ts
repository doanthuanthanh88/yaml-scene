import { Scenario } from "@app/singleton/Scenario"
import { cloneDeep } from "lodash"
import { ElementProxy } from "./ElementProxy"
import { IElement } from './IElement'

export class ElementFactory {
  // Doc~GuideMD
  private static readonly CHAR_SPLIT_FOLDER_CLASS = '~'

  static CreateElement<T extends IElement>(names: string, scenario: Scenario) {
    let [folder, name] = names.split(ElementFactory.CHAR_SPLIT_FOLDER_CLASS)
    if (!name) {
      name = folder
      folder = ''
    }
    let Clazz: typeof Element
    try {
      const Clazzes = require(folder ? `./${folder}/${name}` : `./${name}`)
      Clazz = Clazzes[name] || Clazzes[Object.keys(Clazzes).find(e => e.toLowerCase() === name.toLowerCase())]
      if (!Clazz) throw new Error(`Could not found "${folder}${name}"`)
    } catch (err1) {
      try {
        Clazz = scenario.extensions.getGlobalExtension(name)
        if (!Clazz) {
          const Clazzes = scenario.extensions.load(`${folder}`)
          Clazz = Clazzes[name] || Clazzes[Object.keys(Clazzes).find(e => e.toLowerCase() === name.toLowerCase())]
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
