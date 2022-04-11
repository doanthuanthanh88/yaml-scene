import { inspect } from "util";
import { IPrinterTransform } from "./IPrinterTransform";

export class Json implements IPrinterTransform {
  constructor(private adapter: IPrinterTransform, public config = {} as { pretty: boolean }) {

  }

  print(obj: any): string {
    let rs = this.adapter.print(obj)
    if (rs && typeof rs === 'object') {
      try {
        rs = this.config?.pretty ? JSON.stringify(rs, null, '  ') : JSON.stringify(rs)
      } catch {
        rs = inspect(rs, false, 10, this.config?.pretty)
      }
    }
    return rs
  }
}
