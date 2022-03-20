import chalk from "chalk";
import { IPrinterTransform } from "./IPrinterTransform";

export class Colorize implements IPrinterTransform {
  constructor(private adapter: IPrinterTransform, public color: string) {
    if (!chalk[this.color]) {
      throw new Error(`Echo not support color "${this.color}"`)
    }
  }

  print(obj: any): string {
    return chalk[this.color](this.adapter.print(obj))
  }
}
