import { ExtensionManager } from "@app/singleton/ExtensionManager";

export class PrinterTransformFactory {
  static GetTransform(adapterName: string) {
    return ExtensionManager.Instance.load(adapterName, __dirname)
  }
}