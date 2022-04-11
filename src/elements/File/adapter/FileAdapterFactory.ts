import { ExtensionManager } from "@app/singleton/ExtensionManager";

export class FileAdapterFactory {
  static async GetAdapter(adapterName: string) {
    const Clazz = await ExtensionManager.Instance.load(adapterName, __dirname)
    return Clazz
  }
}