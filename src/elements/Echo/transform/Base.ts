import { IPrinterTransform } from "./IPrinterTransform";

export class Base implements IPrinterTransform {
  print(obj: any): string {
    return obj
  }
}
