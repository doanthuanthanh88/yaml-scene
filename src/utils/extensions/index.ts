import { Simulator } from "@app/Simulator";
import { Scenario } from "@app/singleton/Scenario";
import chalk from "chalk";
import { spawn } from "child_process";
import { existsSync, rmSync } from "fs";
import { join } from "path";
import { ExtensionNotFound } from "../error/ExtensionNotFound";
import { Exec } from "./Exec";

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
export class Extensions {
  private extensionElements = {}
  private globalExtensionPaths = new Array<string>()
  private localExtensionPaths = {}
  private installExtensionPath: string

  constructor(public scenario: Scenario) { }

  getGlobalExtension(name: string) {
    return this.extensionElements[name]
  }

  load(p: string, modulePath = '', defaultKey = 'default') {
    let obj: any;
    try {
      obj = require(join(modulePath, p));
      if (defaultKey !== null) obj = obj[defaultKey] || obj[p]
      return obj
    } catch {
      if (this.extensionElements[p]) return this.extensionElements[p]
      try {
        obj = require(p);
        if (defaultKey !== null) obj = obj[defaultKey] || obj[p]
        this.extensionElements[p] = obj
        return obj
      } catch {
        // try {
        modulePath = this.getPathLocalModule(p) || this.getPathGlobalModule(p);
        if (!modulePath) {
          throw new ExtensionNotFound(p, `Please install module "${p}" by command "yas add ${p.split('/')[0]}"`)
        }
        obj = require(modulePath)
        if (defaultKey !== null) obj = obj[defaultKey] || obj[p]
        this.extensionElements[p] = obj
        // } catch (err) {
        //   const logger = this.scenario.loggerFactory.getLogger()
        //   logger.error(chalk.red(err0.message));
        //   logger.error(chalk.red(err.message));
        //   throw err;
        // }
      }
    }
    return obj
  }

  async registerGlobalExtension(extensions: { [name: string]: string }) {
    Object.entries(extensions).forEach(([name, pathExt]) => {
      const path = this.scenario.resolvePath(pathExt)
      if (existsSync(path)) {
        try {
          // If is file
          const localModule = require(path)?.default
          this.extensionElements[name] = localModule
        } catch (err) {
          // If is directory
          this.localExtensionPaths[name] = path
        }
      } else {
        this.globalExtensionPaths.forEach(path => {
          const npmYarnModule = join(path, pathExt)
          if (existsSync(npmYarnModule)) {
            const globalModule = require(npmYarnModule)
            this.extensionElements[npmYarnModule] = globalModule
          }
        })
      }
    })
  }

  async uninstall() {
    if (this.installExtensionPath) {
      rmSync(this.installExtensionPath, { recursive: true, force: true })
    }
  }

  static async UninstallPackage(installInfo: { dependencies: string[], localPath?: string }, logger = console as any) {
    let cmds = []
    const { dependencies = [], localPath = join(__dirname, '../../../') } = installInfo
    cmds = [
      { title: 'in yarn global', cmd: ['yarn', 'global', 'remove', ...dependencies] },
      { title: 'in npm global', cmd: ['npm', 'uninstall', '-g', ...dependencies] },
      { title: `yarn local at ${localPath}`, cmd: ['yarn', 'remove', '--prefix', localPath, ...dependencies].filter(e => e) },
      { title: `npm local at ${localPath}`, cmd: ['npm', 'uninstall', '--prefix', localPath, ...dependencies].filter(e => e) },
    ]
    let errors = []
    logger.log(chalk.red(`Unstalling ...`))
    for (const { title, cmd } of cmds) {
      try {
        Exec.Run(cmd)
        dependencies.forEach(e => console.log(chalk.red(`✔ ${e} ${chalk.gray(title)}`)))
      } catch (err) {
        errors.push(err)
      }
    }
    if (errors.length === cmds.length) {
      errors.forEach(err => logger.error(err))
      throw new Error(`Could not install "${dependencies}" to ${global ? 'global' : `"${localPath}"`}`)
    }
  }

  static async InstallPackage(installInfo: { dependencies: string[], localPath?: string, global?: boolean, isSave?: boolean }, logger = console as any) {
    let cmds = []
    const { dependencies = [], localPath = join(__dirname, '../../../'), global, isSave } = installInfo
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
    logger.log(chalk.green(`Installing ...`))
    for (const { title, cmd } of cmds) {
      try {
        Exec.Run(cmd)
        dependencies.forEach(e => console.log(chalk.green(`✔ ${e} ${chalk.gray(title)}`)))
        errors = []
        break
      } catch (err) {
        errors.push(err)
      }
    }
    if (errors.length) {
      errors.forEach(err => logger.error(err))
      throw new Error(`Could not install "${dependencies}" to ${global ? 'global' : `"${localPath}"`}`)
    }
  }

  async install(installInfo: { dependencies: string[], localPath?: string, global?: boolean, isSave?: boolean }) {
    if (!installInfo) return
    if (!installInfo.localPath) installInfo.localPath = this.scenario.rootDir
    installInfo.localPath = this.scenario.resolvePath(installInfo.localPath)
    if (installInfo.isSave === undefined) installInfo.isSave = !Simulator.IS_RUNNING
    if (!installInfo.global) {
      this.installExtensionPath = installInfo.localPath
      this.globalExtensionPaths.splice(0, 0, this.installExtensionPath)
    }
    await Extensions.InstallPackage(installInfo, this.scenario.loggerFactory.getLogger())
  }

  async loadNpmYarnGlobalPaths() {
    const globalDirs = await Promise.all([
      (async () => {
        try {
          const rs = await this.execShell("npm", ["root", "-g"])
          return rs.split('\n')
            .map((f) => f?.trim())
            .filter((f) => f && existsSync(f))
        } catch (err) {
          console.error(err);
        }
        return []
      })(),
      (async () => {
        try {
          const rs = await this.execShell("yarn", ["global", "dir"])
          return rs.split('\n')
            .map((f) => {
              f = f?.trim();
              return f ? join(f, "node_modules") : f;
            })
            .filter((f) => f && existsSync(f))
        } catch (err) {
          console.error(err);
        }
        return []
      })(),
    ]).then(([npmGlobalDirs, yarnGlobalDirs]) => {
      return npmGlobalDirs.concat(yarnGlobalDirs)
    })
    globalDirs.forEach(gd => {
      if (!this.globalExtensionPaths.includes(gd)) this.globalExtensionPaths.push(gd)
    })
  }

  private getPathLocalModule(name: string) {
    let modulePath = undefined;
    const localExtensionKey = Object.keys(this.localExtensionPaths).find(prefix => name.startsWith(prefix))
    if (localExtensionKey) {
      const path = this.localExtensionPaths[localExtensionKey]
      modulePath = join(path, name.replace(new RegExp(`^${localExtensionKey}\\/?`), ''))
      try {
        require.resolve(modulePath);
        return modulePath;
      } catch { }
    }
  }

  private getPathGlobalModule(name: string) {
    let modulePath = undefined;
    for (const path of this.globalExtensionPaths) {
      modulePath = join(path, name);
      try {
        require.resolve(modulePath);
        return modulePath;
      } catch { }
    }
    modulePath = this.scenario.resolvePath(name)
    try {
      require.resolve(modulePath);
      return modulePath;
    } catch { }
  }

  private execShell(cmd: string, args: string[]) {
    return new Promise<string>((resolve, reject) => {
      const sp = spawn(cmd, args)
      let mes = ''
      sp.stdout.on('data', (m) => {
        mes += m.toString()
      })
      sp.stderr.on('data', (m) => {
        mes += m.toString()
      })
      sp.once('close', (code) => {
        if (!code) {
          resolve(mes)
        } else {
          reject(new Error(mes))
        }
      })
    })

  }

}