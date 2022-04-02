import { TraceError } from "@app/utils/error/TraceError";
import chalk, { Chalk } from "chalk";
import { IPrinterTransform } from "./IPrinterTransform";

export class Colorize implements IPrinterTransform {
  private _colorize: Chalk

  constructor(private adapter: IPrinterTransform, public color: string) {
    this._colorize = this.color
      .split('.')
      .reduce((chalk, style) => {
        try {
          // @ts-ignore
          return chalk[style.trim()]
        } catch {
          throw new TraceError(`Echo not support color "${this.color}"`)
        }
      }, chalk)
  }

  print(obj: any): string {
    return this._colorize(this.adapter.print(obj))
  }
}
