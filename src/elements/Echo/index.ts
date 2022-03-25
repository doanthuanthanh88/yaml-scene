import merge from "lodash.merge"
import { ElementProxy } from "../ElementProxy"
import { IElement } from "../IElement"
import { Base } from "./transform/Base"
import { IPrinterTransform } from "./transform/IPrinterTransform"
import { PrinterTransformFactory } from "./transform/PrinterTransformFactory"

/**
 * @guide
 * @name Echo
 * @description Print data to screen
 * @group Output
 * @example
- Echo: Hello world                       # Print white text

- Echo/Green: Green text                  # Print green text

- Echo/Blue: Blue text                    # Print blue text

- Echo/Red: Red text                      # Print red text

- Echo/Yellow: Yellow text                # Print yellow text

- Echo/Cyan: Cyan text                    # Print cyan text

- Echo/Gray: Gray text                    # Print gray text

- Echo:                                   
    message: Hello
    color: green
    pretty: true

- Vars:
    user:
      name: thanh
      sex: male

- Echo/Schema: ${user}                    # Print object schema

- Echo/Schema:
    message: ${user}
    color: gray
    pretty: true
 * @end
 */
export default class Echo implements IElement {
  proxy: ElementProxy<any>

  message: string | object
  color?: string
  pretty?: boolean
  schema?: boolean
  transforms: (string | object)[]

  private _transform: IPrinterTransform
  private _transformClasses: {
    TransformClass: any,
    args?: any
  }[]

  init(props: any) {
    if (typeof props === 'object') {
      merge(this, props)
    } else {
      this.message = props
    }

    if (!this.transforms) this.transforms = []
    if (!Array.isArray(this.transforms)) this.transforms = [this.transforms]
    if (!this.transforms.length) {
      if (this.schema) this.transforms.push({ Schema: {} })
      if (this.pretty) this.transforms.push({ Json: { pretty: this.pretty } })
      if (this.color) this.transforms.push({ Colorize: this.color })

      if (!this.transforms.length) this.transforms.push('Json')
    }
  }

  prepare() {
    this._transformClasses = this.transforms.map(transform => {
      const transformName = typeof transform === 'string' ? transform : Object.keys(transform)[0]
      if (!transformName) throw new Error('"transforms" is not valid')
      return {
        TransformClass: PrinterTransformFactory.GetTransform(transformName, this.proxy.scenario.extensions),
        args: transform[transformName]
      }
    })
  }

  exec() {
    this._transformClasses.forEach(({ TransformClass, args }) => {
      this._transform = new TransformClass(this._transform || new Base(), args)
    })
    const message = this.proxy.getVar(this.message)
    const txt = this._transform.print(message)
    this.proxy.logger.info(txt)
  }

}