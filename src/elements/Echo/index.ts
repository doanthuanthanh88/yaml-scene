import { TraceError } from "@app/utils/error/TraceError"
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
    color: green.bgRed
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
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  message: string | object
  color?: string
  pretty?: boolean
  schema?: boolean
  transforms: (string | object)[]

  private _transform: IPrinterTransform

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

  async prepare() {
    await this.proxy.applyVars(this, 'color', 'pretty', 'schema', 'transforms')
    this.transforms
      .forEach(transform => {
        const transformName = typeof transform === 'string' ? transform : Object.keys(transform)[0]
        if (!transformName) throw new TraceError('"transforms" is not valid', { transform })
        const TransformClass = PrinterTransformFactory.GetTransform(transformName)
        const args = transform[transformName]
        this._transform = new TransformClass(this._transform || new Base(), args)
      })
  }

  async exec() {
    const message = await this.proxy.getVar(this.message)
    const txt = this._transform.print(message)
    this.proxy.logger.info(txt)
  }

}