import { ExtensionManager } from "@app/singleton/ExtensionManager";

export class FileAdapterFactory {
  static GetAdapter(adapterName: string) {
    return ExtensionManager.Instance.load(adapterName, __dirname)
  }
}