import toJsonSchema from "to-json-schema";
import { IFormat } from "./IFormat";

export class SchemaFormat implements IFormat {
  opts: any = {
    arrays: { mode: 'all' },
    strings: { detectFormat: false }
  }

  format(input: any, isPretty: boolean): string {
    const obj = toJsonSchema(input, this.opts)
    obj.example = input
    return isPretty ? JSON.stringify(obj, null, '  ') : JSON.stringify(obj)
  }

}