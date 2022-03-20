import { Extensions } from "@app/utils/extensions";

export class PrinterTransformFactory {
  static GetTransform(adapterName: string, extensions: Extensions) {
    return extensions.load(adapterName, __dirname)
  }
}