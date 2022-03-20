import { IPrinterTransform } from "./IPrinterTransform";
import toJsonSchema from "to-json-schema";
import merge from 'lodash.merge'

export class Schema implements IPrinterTransform {
  constructor(private adapter: IPrinterTransform, public config = {}) {
    merge(this.config, {
      arrays: { mode: 'all' },
      strings: { detectFormat: false }
    }, config)
  }

  print(obj: any) {
    const rs = toJsonSchema(this.adapter.print(obj), this.config as any)
    return rs
  }
}
