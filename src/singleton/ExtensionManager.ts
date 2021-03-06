import { UrlReader } from "@app/elements/File/reader/UrlReader";
import { FileWriter } from "@app/elements/File/writer/FileWriter";
import { IElement } from "@app/elements/IElement";
import { Scenario } from "@app/singleton/Scenario";
import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { execSync } from "child_process";
import { statSync } from "fs";
import { basename, join } from "path";
import { ExtensionNotFound } from "../utils/error/ExtensionNotFound";
import { GlobalModuleManager } from "./GlobalModuleManager";
import { InstallationManager } from "./InstallationManager";
import { LocalModuleManager } from "./LocalModuleManager";
import { LoggerManager } from "./LoggerManager";
import { ScenarioEvent } from "./ScenarioEvent";

/*****
@h2 #
@name How to create a new extension
@description You can create a new extension in local or publish to npm registry

Please reference the below links for details:  
- A [Extension template project](https://github.com/doanthuanthanh88/yaml-scene-extensions) which provides commands to unit test, build, document... to deploy to npm or something like that
- [Extension files](./yaml-test/examples/custom-extension) which implemented extension interface
*/
export class ExtensionManager {
  private static _Instance: ExtensionManager

  static get Instance() {
    if (!this._Instance) {
      Scenario.Instance.events.once(ScenarioEvent.RESET, () => {
        this._Instance = undefined
      })
      this._Instance = new ExtensionManager()
    }
    return this._Instance
  }

  static Resolve(name: string) {
    try {
      return require.resolve(name)
    } catch { }
    return undefined
  }

  private extensionElements: { [key: string]: IElement } = {}
  public globalModuleManager?: GlobalModuleManager
  public installModuleManager?: GlobalModuleManager
  private localModuleManager?: LocalModuleManager
  private installExtensionPath?: string

  constructor() {
    this.loadNpmYarnGlobalPaths()
  }

  async load(p: string, modulePath = '') {
    let obj: any;
    do {
      try {
        // Load directly from src/elements/
        obj = require(join(modulePath, p))
        obj = this.getObjectInExport(obj, p)
      } catch (err1) {
        if (this.extensionElements[p]) return this.extensionElements[p]
        try {
          // Load from `extensions` OR `install` in scenario OR yaml-scene/node_modules OR `yarn global` or `npm global`
          modulePath = this.localModuleManager?.get(p) || this.installModuleManager?.get(p) || ExtensionManager.Resolve(p) || this.globalModuleManager?.get(p)
          if (!modulePath) throw new ExtensionNotFound(p, `The scenario is using a new element "${p}"`)

          obj = require(modulePath)
          obj = this.getObjectInExport(obj, p)
          this.extensionElements[p] = obj
        } catch (error: any) {
          let err: ExtensionNotFound
          if (!(error instanceof ExtensionNotFound)) {
            err = new ExtensionNotFound(p, `The scenario is using a new element "${p}"`)
          } else {
            err = error
          }
          LoggerManager.GetLogger().trace(err1, err)
          await InstallationManager.Instance.installNow(err)
        }
      }
    } while (!obj)
    return obj
  }

  async registerGlobalExtension(extensions: { [name: string]: string }) {
    for (const [name, pathExt] of Object.entries(extensions)) {
      let localPath = Scenario.Instance.resolvePath(pathExt)
      const exsited = FileUtils.Existed(localPath)
      if (!exsited) {
        throw new TraceError(`Could not found extensions "${name}" in "${localPath}"`, { localPath, name, pathExt })
      }
      if (exsited === 'url') {
        const url = new UrlReader(pathExt)
        const buf = await url.read()

        localPath = FileUtils.GetNewTempPathThenClean('.js')
        const file = new FileWriter(localPath)
        await file.write(buf)

      }
      try {
        // If is file
        const localModule = require(localPath)
        this.extensionElements[name] = this.getObjectInExport(localModule, name)
      } catch (err) {
        LoggerManager.GetLogger().trace(err)
      }
      if (statSync(localPath).isDirectory()) {
        // If is directory
        if (!this.localModuleManager) this.localModuleManager = new LocalModuleManager()
        this.localModuleManager.add(name, localPath)
      }
    }
  }

  async uninstall() {
    if (this.installExtensionPath) {
      FileUtils.RemoveFilesDirs(this.installExtensionPath)
    }
  }

  async install(installInfos: { local?: { dependencies: string[], path?: string }, global?: { dependencies: string[] } }) {
    if (!installInfos) return
    const dependencies = new Array<ExtensionNotFound>()
    if (installInfos.local) {
      const info = installInfos.local
      dependencies.push(...info.dependencies.map(packageName => {
        if (!info.path) info.path = Scenario.Instance.element.rootDir
        this.installExtensionPath = info.path = Scenario.Instance.resolvePath(info.path)
        if (!this.installModuleManager) this.installModuleManager = new GlobalModuleManager()
        FileUtils.MakeDirExisted(this.installExtensionPath, 'dir')
        this.installModuleManager.add(this.installExtensionPath)

        const ext = new ExtensionNotFound(packageName, `Installing "${packageName}" ...`, 'local')
        ext.localPath = info.path
        ext.force = true
        return ext
      }))
    }
    if (installInfos.global) {
      const info = installInfos.global
      dependencies.push(...info.dependencies.map(packageName => {
        const ext = new ExtensionNotFound(packageName, `Installing "${packageName}" ...`, 'global')
        ext.force = true
        return ext
      }))
    }
    await InstallationManager.Instance.installNow(...dependencies)
  }

  private loadNpmYarnGlobalPaths() {
    ["yarn global dir", "npm root -g"].forEach(cmd => {
      try {
        const cnt = execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString()
        if (!this.globalModuleManager && cnt) {
          this.globalModuleManager = new GlobalModuleManager()
        }
        cnt.split('\n')
          .map(f => f.trim())
          .filter(f => f)
          .forEach(gd => this.globalModuleManager.add(gd))
      } catch (err) {
        LoggerManager.GetLogger().trace(err)
      }
    })
    if (!this.globalModuleManager?.modules.length) {
      LoggerManager.GetLogger().warn('Could not found "npm" or "yarn"')
    }
  }

  private getObjectInExport(obj: any, p: string) {
    return obj.default || obj[basename(p)]
  }
}
