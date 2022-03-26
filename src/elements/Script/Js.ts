import { Functional } from "@app/tags/model/Functional";
import { ElementProxy } from "../ElementProxy";
import { IElement } from "../IElement";

/**
 * @guide
 * @name Script/Js
 * @description Embed javascript code into scene
 * @group External
 * @example
- Vars:
    name: 10

- Script/Js: !function |
    console.log('oldValue', name)
    $.proxy.setVar('newName', name + 10)      # `$` is referenced to `Js` element in `Script`

- Echo: New value ${newName}
 * @end
 */
export default class Js implements IElement {
  proxy: ElementProxy<any>
  func: Functional

  init(func: string | Functional) {
    this.func = Functional.GetFuntion(func)
  }

  async exec() {
    const rs = await this.proxy.eval(this.func.toString())
    return rs
  }

}