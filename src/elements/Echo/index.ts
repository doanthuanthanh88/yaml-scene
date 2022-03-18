import chalk from "chalk"
import merge from "lodash.merge"
import { ElementProxy } from "../ElementProxy"
import { IElement } from "../IElement"
import { FormatFactory } from "./format/FormatFactory"
import { IFormat } from "./format/IFormat"

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
  type?: 'schema'
  pretty?: boolean

  get formater(): IFormat {
    return this.type !== 'schema' ? FormatFactory.Get('DataFormat') : FormatFactory.Get('SchemaFormat')
  }

  init(opts: any) {
    if (typeof opts === 'object') {
      merge(this, opts)
    } else {
      this.message = opts
    }
  }

  exec() {
    const message = this.proxy.getVar(this.message)
    const txt = this.formater.format(message, this.pretty)
    this.proxy.logger.info(this.color ? chalk[this.color](txt) : txt)
  }

}