import { ExtensionManager } from "@app/singleton/ExtensionManager";

export class FileReaderFactory {
  static async GetReader(adapterName: string) {
    const Clazz = await ExtensionManager.Instance.load(`${adapterName}Reader`, __dirname)
    return Clazz
  }
}