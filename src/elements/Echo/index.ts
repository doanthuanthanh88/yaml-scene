import { TraceError } from "@app/utils/error/TraceError"
import merge from "lodash.merge"
import { ElementProxy } from "../ElementProxy"
import { IElement } from "../IElement"
import { Base } from "./transform/Base"
import { IPrinterTransform } from "./transform/IPrinterTransform"
import { PrinterTransformFactory } from "./transform/PrinterTransformFactory"

/*****
@name Echo
@description Print data to screen
@group Output
@example
# Print text message

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

@example
# Inspect data

- Vars:
    user:
      name: thanh
      sex: male

- Echo: ${user}

@example
# Print object schema

- Vars:
    user:
      name: thanh
      sex: male

- Echo/Schema: ${user}                    # Print object schema

- Echo/Schema:
    message: ${user}
    color: gray
    pretty: true
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

  constructor() {
    this.transforms = []
  }

  init(props: any) {
    if (typeof props === 'object') {
      merge(this, props)
    } else {
      this.message = props
    }
  }

  async prepare() {
    await this.proxy.applyVars(this, 'color', 'pretty', 'schema', 'transforms')

    if (!Array.isArray(this.transforms)) this.transforms = [this.transforms]
    if (!this.transforms.length) {
      if (this.schema) this.transforms.push({ Schema: {} })
      if (this.pretty) this.transforms.push({ Json: { pretty: this.pretty } })
      if (this.color) this.transforms.push({ Colorize: this.color })

      if (!this.transforms.length) this.transforms.push('Json')
    }

    await Promise.all(this.transforms.map(async transform => {
      const transformName = typeof transform === 'string' ? transform : Object.keys(transform)[0]
      if (!transformName) throw new TraceError('"transforms" is not valid', { transform })
      const TransformClass = await PrinterTransformFactory.GetTransform(transformName)
      const args = transform[transformName]
      this._transform = new TransformClass(this._transform || new Base(), args)
    }))
  }

  async exec() {
    const message = await this.proxy.getVar(this.message)
    const txt = this._transform.print(message)
    this.proxy.logger.info(txt)
  }

}