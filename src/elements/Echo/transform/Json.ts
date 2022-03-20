import { IPrinterTransform } from "./IPrinterTransform";

export class Json implements IPrinterTransform {
  constructor(private adapter: IPrinterTransform, public config = {} as { pretty: boolean }) {

  }

  print(obj: any): string {
    let rs = this.adapter.print(obj)
    if (rs && typeof rs === 'object') {
      rs = this.config?.pretty ? JSON.stringify(rs, null, '  ') : JSON.stringify(rs)
    }
    return rs
  }
}
