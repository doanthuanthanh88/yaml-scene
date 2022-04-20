import { join } from "path";
import { ExtensionManager } from "./ExtensionManager";

export class LocalModuleManager {

  modules: any;

  constructor() {
    this.modules = {};
  }

  add(name: string, path: string) {
    this.modules[name] = path;
  }

  get(name: string) {
    const localExtensionKey = Object.keys(this.modules).find(prefix => name.startsWith(prefix));
    if (localExtensionKey) {
      const path = this.modules[localExtensionKey];
      const modulePath = join(path, name.replace(new RegExp(`^${localExtensionKey}\\/?`), ''));
      return ExtensionManager.Resolve(modulePath);
    }
  }
}
