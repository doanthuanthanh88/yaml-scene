import { ExtensionManager } from "@app/singleton/ExtensionManager";

export class PrinterTransformFactory {
  static async GetTransform(adapterName: string) {
    const Clazz = await ExtensionManager.Instance.load(adapterName, __dirname)
    return Clazz
  }
}