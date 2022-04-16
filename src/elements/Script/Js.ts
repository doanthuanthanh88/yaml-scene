import { Functional } from "@app/tags/model/Functional";
import { TraceError } from "@app/utils/error/TraceError";
import merge from 'lodash.merge';
import { ElementProxy } from "../ElementProxy";
import { IElement } from "../IElement";

/*****
@name Script/Js
@description Embed javascript code into scene
@group External
@example
- Vars:
    name: 10
    age: 10

- Script/Js: 
    title: Test something
    content: !function |
      ({ name }) {                                        # Passed global variables into function                                    
        console.log('oldValue', name)
        await this.proxy.setVar('newName', name + 10)     # `this` is referenced to `Js` element in `Script`
      }

- Script/Js: !function |
    ({ name, age }) {                                     # "name", "age" are global variables
      console.log('oldValue', name)
      this.proxy.vars.newName = name + 10                 # `this` is referenced to `Js` element in `Script`
    }
    
- Echo: New value ${newName}
*/
export default class Js implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  private _func: Functional
  title?: string

  init(props: any) {
    if (typeof props === 'string' || props instanceof Functional) {
      this._func = Functional.GetFunction(props)
    } else if (props?.content) {
      const { content, ...others } = props
      merge(this, others)
      this._func = Functional.GetFunction(content)
    } else {
      throw new TraceError('JS script is required')
    }
  }

  prepare() {

  }

  async exec() {
    if (this.title) this.proxy.logger.info(this.title)
    this.title && console.group()
    try {
      const func = this._func.getFunctionFromBody()
      const rs = await this.proxy.call(func, undefined, this)
      return rs
    } catch (err) {
      debugger
    } finally {
      this.title && console.groupEnd()
    }
  }

}