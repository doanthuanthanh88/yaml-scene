import Exec from "@app/elements/Exec";
import { Simulator } from "@app/Simulator";
import { Scenario } from "@app/singleton/Scenario";
import { TraceError } from "@app/utils/error/TraceError";
import chalk from "chalk";
import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import { join } from "path";
import { ExtensionNotFound } from "../utils/error/ExtensionNotFound";
import { LoggerManager } from "./LoggerManager";

/**
 * @guide
 * @h2 #
 * @name How to create a new extension
 * @description You can create a new extension in local or publish to npm registry

Please reference the below links for details:  
- A [Extension template project](https://github.com/doanthuanthanh88/yaml-scene-extensions) which provides commands to unit test, build, document... to deploy to npm or something like that
- [Extension files](./yaml-test/examples/custom-extension) which implemented extension interface
 * @end
 */
export class ExtensionManager {
  private static _Instance: ExtensionManager

  static get Instance() {
    return this._Instance || (this._Instance = new ExtensionManager())
  }

  private extensionElements = {}
  private globalModuleManager = new GlobalModuleManager()
  private localModuleManager: LocalModuleManager
  private installExtensionPath: string

  constructor() {
    this.loadNpmYarnGlobalPaths()
  }

  reset() {
    ExtensionManager._Instance = null
  }

  load(p: string, modulePath = '') {
    let obj: any;
    try {
      // Load directly from src/elements/
      obj = require(join(modulePath, p))
      obj = this.getObjectInExport(obj, p)
    } catch (err1) {
      try {
        // Load from packages in node_modules
        obj = require(p)
        obj = this.getObjectInExport(obj, p)
      } catch (err2) {
        if (this.extensionElements[p]) return this.extensionElements[p]
        // Load from local or global module
        modulePath = this.localModuleManager?.get(p) || this.globalModuleManager.get(p)
        if (!modulePath) {
          LoggerManager.GetLogger().trace(err1)
          LoggerManager.GetLogger().trace(err2)
          throw new ExtensionNotFound(p, `The scenario is using a new element "${p}"`)
        }
        obj = require(modulePath)
        obj = this.getObjectInExport(obj, p)
        this.extensionElements[p] = obj
      }
    }
    return obj
  }

  async registerGlobalExtension(extensions: { [name: string]: string }) {
    Object.entries(extensions)
      .forEach(([name, pathExt]) => {
        const localPath = Scenario.Instance.resolvePath(pathExt)
        if (!existsSync(localPath)) {
          throw new TraceError(`Could not found extensions "${name}" in "${localPath}"`, { localPath, name, pathExt })
        }
        try {
          // If is file
          const localModule = require(localPath)
          this.extensionElements[name] = this.getObjectInExport(localModule, name)
        } catch (err) {
          // If is directory
          if (!this.localModuleManager) this.localModuleManager = new LocalModuleManager()
          this.localModuleManager.add(name, localPath)
        }
      })
  }

  static async UninstallPackage(installInfo: { dependencies: string[], localPath?: string }) {
    let cmds = []
    const { dependencies = [], localPath = join(__dirname, '../../') } = installInfo
    cmds = [
      { title: 'in yarn global', cmd: ['yarn', 'global', 'remove', ...dependencies] },
      { title: 'in npm global', cmd: ['npm', 'uninstall', '-g', ...dependencies] },
      { title: `yarn local at ${localPath}`, cmd: ['yarn', 'remove', '--prefix', localPath, ...dependencies].filter(e => e) },
      { title: `npm local at ${localPath}`, cmd: ['npm', 'uninstall', '--prefix', localPath, ...dependencies].filter(e => e) },
    ]
    let errors = []
    LoggerManager.GetLogger().info(chalk.red(`Unstalling ...`))
    for (const { title, cmd } of cmds) {
      try {
        const log = Exec.Run(cmd)
        if (log.error) throw log.error
        dependencies.forEach(e => LoggerManager.GetLogger().info(chalk.red(`✔ ${e} ${chalk.gray(title)}`)))
      } catch (err) {
        errors.push(err)
      }
    }
    if (errors.length === cmds.length) {
      throw new TraceError(`Could not install "${dependencies}" to ${global ? 'global' : `"${localPath}"`}`, { errors })
    }
  }

  static async UpgradePackage(installInfo: { dependencies: string[], localPath?: string }) {
    let cmds = []
    const { dependencies = [], localPath = join(__dirname, '../../') } = installInfo
    cmds = [
      { title: 'in yarn global', cmd: ['yarn', 'global', 'upgrade', ...dependencies] },
      { title: 'in npm global', cmd: ['npm', 'upgrade', '-g', ...dependencies] },
      { title: `yarn local at ${localPath}`, cmd: ['cd', localPath, '&&', 'yarn', 'upgrade', ...dependencies].filter(e => e) },
      { title: `npm local at ${localPath}`, cmd: ['cd', localPath, '&&', 'npm', 'upgrade', ...dependencies].filter(e => e) },
    ]
    let errors = []
    LoggerManager.GetLogger().info(chalk.yellow(`Upgrading ...`))
    for (const { title, cmd } of cmds) {
      try {
        const log = Exec.Run(cmd)
        if (log.error) throw log.error
        dependencies.forEach(e => LoggerManager.GetLogger().info(chalk.yellow(`✔ ${e} ${chalk.gray(title)}`)))
      } catch (err) {
        errors.push(err)
      }
    }
    if (errors.length === cmds.length) {
      throw new TraceError(`Could not upgrade "${dependencies}" to ${global ? 'global' : `"${localPath}"`}`, { errors })
    }
  }

  static async InstallPackage(installInfo: { dependencies: string[], localPath?: string, global?: boolean, isSave?: boolean }) {
    let cmds = []
    const { dependencies = [], localPath = join(__dirname, '../../'), global, isSave } = installInfo
    if (global) {
      cmds = [
        { title: `in yarn global`, cmd: ['yarn', 'global', 'add', ...dependencies] },
        { title: `in npm global`, cmd: ['npm', 'install', '-g', ...dependencies] },
      ]
    } else {
      cmds = [
        { title: `yarn local at ${localPath}`, cmd: ['yarn', 'add', '--prefix', localPath, ...dependencies].filter(e => e) },
        { title: `npm local at ${localPath}`, cmd: ['npm', 'install', `${!isSave ? '--no-save' : ''}`, '--prefix', localPath, ...dependencies].filter(e => e) },
      ]
      if (!isSave) cmds.reverse()
    }
    let errors = []
    LoggerManager.GetLogger().log(chalk.green(`Installing ...`))
    for (const { title, cmd } of cmds) {
      try {
        const log = Exec.Run(cmd)
        if (log.error) throw log.error
        dependencies.forEach(e => LoggerManager.GetLogger().info(chalk.green(`✔ ${e} ${chalk.gray(title)}`)))
        errors = []
        break
      } catch (err) {
        errors.push(err)
      }
    }
    if (errors.length) {
      throw new TraceError(`Could not install "${dependencies}" to ${global ? 'global' : `"${localPath}"`}`, { errors })
    }
  }

  async uninstall() {
    if (this.installExtensionPath) {
      rmSync(this.installExtensionPath, { recursive: true, force: true })
    }
  }

  async install(installInfo: { dependencies: string[], localPath?: string, global?: boolean, isSave?: boolean }) {
    if (!installInfo) return
    if (!installInfo.localPath) installInfo.localPath = Scenario.Instance.rootDir
    installInfo.localPath = Scenario.Instance.resolvePath(installInfo.localPath)
    if (installInfo.isSave === undefined && Simulator.IS_RUNNING) installInfo.isSave = false
    if (!installInfo.global) {
      this.installExtensionPath = installInfo.localPath
      this.globalModuleManager.add(this.installExtensionPath)
    }
    await ExtensionManager.InstallPackage(installInfo)
  }

  private loadNpmYarnGlobalPaths() {
    ["yarn global dir", "npm root -g"].forEach(cmd => {
      try {
        execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().split('\n')
          .map((f) => f?.trim())
          .filter((f) => f && existsSync(f) && !this.globalModuleManager.modules.includes(f))
          .forEach(gd => this.globalModuleManager.modules.push(gd))
      } catch (err) {
        LoggerManager.GetLogger().trace(err)
      }
    })
    if (!this.globalModuleManager.modules.length) {
      throw new TraceError('Could not found "npm" or "yarn"')
    }
  }

  private getObjectInExport(obj: any, p: string) {
    return obj.default || obj[p.substring(p.lastIndexOf('/') + 1)]
  }
}

class LocalModuleManager {

  modules: any

  constructor() {
    this.modules = {}
  }

  add(name: string, path: string) {
    this.modules[name] = path
  }

  get(name: string) {
    const localExtensionKey = Object.keys(this.modules).find(prefix => name.startsWith(prefix))
    if (localExtensionKey) {
      const path = this.modules[localExtensionKey]
      const modulePath = join(path, name.replace(new RegExp(`^${localExtensionKey}\\/?`), ''))
      try {
        require.resolve(modulePath);
        return modulePath;
      } catch { }
    }
  }

}

class GlobalModuleManager {
  modules: string[]

  constructor() {
    this.modules = []
  }

  add(path: string) {
    this.modules.splice(0, 0, path)
  }

  get(name: string) {
    try {
      return require.resolve(name, {
        paths: this.modules.concat(Scenario.Instance.resolvePath('.'))
      })
    } catch { }
  }

}
