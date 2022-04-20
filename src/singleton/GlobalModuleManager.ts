import { join } from "path";
import { ExtensionManager } from "./ExtensionManager";

export class GlobalModuleManager {
  modules: string[];

  constructor() {
    this.modules = [];
  }

  add(path: string) {
    this.modules.splice(0, 0, path, join(path, 'node_modules'));
  }

  get(name: string) {
    for (const module of this.modules) {
      const modulePath = ExtensionManager.Resolve(join(module, name));
      if (modulePath)
        return modulePath;
    }
    return '';
  }
}
