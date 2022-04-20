import { ExtensionManager } from "@app/singleton/ExtensionManager";

export class FileWriterFactory {
  static async GetWriter(adapterName: string) {
    const Clazz = await ExtensionManager.Instance.load(`${adapterName}Writer`, __dirname)
    return Clazz
  }
}