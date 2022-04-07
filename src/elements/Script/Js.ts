import { Functional } from "@app/tags/model/Functional";
import { TraceError } from "@app/utils/error/TraceError";
import merge from 'lodash.merge';
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
    age: 10

- Script/Js: 
    title: Test something
    content: !function |
      console.log('oldValue', name)
      await $.proxy.setVar('newName', name + 10)      # `$` is referenced to `Js` element in `Script`

- Script/Js: !function |
    console.log('oldValue', name)
    $.proxy.vars.newName = name + 10                  # `$` is referenced to `Js` element in `Script`

- Script/Js: !function |
    ({ name, age })                                        # For best performance, you should add this line to asks vm provides some variables, not at all
    console.log('oldValue', name)
    $.proxy.vars.newName = name + 10                  # `$` is referenced to `Js` element in `Script`
    
- Echo: New value ${newName}
 * @end
 */
export default class Js implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  func: Functional
  title?: string

  init(props: any) {
    if (typeof props === 'string' || props instanceof Functional) {
      this.func = Functional.GetFuntion(props)
    } else if (props?.content) {
      const { content, ...others } = props
      merge(this, others)
      this.func = Functional.GetFuntion(content)
    } else {
      throw new TraceError('JS script is required')
    }
  }

  async exec() {
    if (this.title) this.proxy.logger.info(this.title)
    this.title && console.group()
    try {
      const rs = await this.proxy.eval<any>(this.func?.toString())
      return rs
    } finally {
      this.title && console.groupEnd()
    }
  }

}