import { IFormat } from "./IFormat";

export class DataFormat implements IFormat {
  format(input: any, isPretty: boolean): string {
    if (input && typeof input === 'object') {
      return isPretty ? JSON.stringify(input, null, '  ') : JSON.stringify(input)
    }
    return input
  }

}