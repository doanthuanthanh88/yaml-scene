import { TestCase } from "@app/TestCase"
import { ExternalLibs } from "@app/utils/external-libs"
import { cloneDeep } from "lodash"
import { ElementProxy } from "./ElementProxy"
import { IElement } from './IElement'

export class ElementFactory {
  static CreateElement<T extends IElement>(names: string) {
    let [folder, name] = names.split('#')
    if (!name) {
      name = folder
      folder = ''
    }
    let Clazz: typeof Element
    try {
      const Clazzes = require(folder ? `./${folder}/${name}` : `./${name}`)
      Clazz = Clazzes[name]
      if (!Clazz) throw new Error(`Could not found "${folder}${name}"`)
    } catch (err1) {
      try {
        const Clazzes = ExternalLibs.loadExternalLib(`${folder}`)
        Clazz = Clazzes[name]
        if (!Clazz) throw err1
      } catch (err2) {
        throw new Error('\nError1: ' + err1.message + '\nError2: ' + err2.message)
      }
    }
    let tag: any
    if (Clazz.prototype) {
      tag = new Clazz()
    } else {
      tag = tag.clone ? tag.clone() : cloneDeep(tag)
    }
    return new ElementProxy<T>(tag, TestCase.Instance)
  }
}
