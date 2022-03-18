import { DataFormat } from "./DataFormat";
import { SchemaFormat } from "./SchemaFormat";

export class FormatFactory {
  private static formats = {} as any

  static Get(type: string) {
    if (this.formats[type]) return this.formats[type]
    switch (type) {
      case 'SchemaFormat':
        return this.formats[type] = new SchemaFormat()
      default:
        return this.formats[type] = new DataFormat()
    }
  }
}