import toJsonSchema from "to-json-schema";
import { Echo } from ".";

export class schema extends Echo {
  opts: any = {
    arrays: { mode: 'all' },
    strings: { detectFormat: false }
  }

  format(data: any) {
    const obj = toJsonSchema(data, this.opts)
    obj.example = data
    return obj
  }
}
