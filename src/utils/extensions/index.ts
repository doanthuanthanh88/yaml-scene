import { Simulator } from "@app/Simulator";
import { Scenario } from "@app/singleton/Scenario";
import chalk from "chalk";
import { spawn } from "child_process";
import { existsSync, rmSync } from "fs";
import { join } from "path";
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

  load(p: string, modulePath = '') {
    let obj: any;
    if (this.extensionElements[p]) return this.extensionElements[p]
    try {
      try {
        obj = require(`${join(modulePath, p)}`);
      } catch {
        obj = require(p);
      }
      obj = obj.default || obj[p]
      this.extensionElements[p] = obj
      return obj
    } catch (err0) {
      try {
        modulePath = this.getPathLocalModule(p) || this.getPathGlobalModule(p);
        if (!modulePath) {
          throw new Error(
            `Please install module "${p}" \n    \`npm install -g ${p}\` \n OR \n    \`yarn global add ${p}\``
          )
        }
        obj = require(modulePath)
        obj = obj.default || obj[p]
        this.extensionElements[p] = obj
      } catch (err) {
        this.scenario.loggerFactory.getLogger().error(chalk.red(err0.message));
        this.scenario.loggerFactory.getLogger().error(chalk.red(err.message));
        throw err;
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

  async setup(extensions = {} as { [name: string]: string }) {
    await this.loadNpmYarnGlobalPaths()
    await this.registerGlobalExtension(extensions)
  }

  async uninstall() {
    if (this.installExtensionPath) {
      rmSync(this.installExtensionPath, { recursive: true, force: true })
    }
  }

  static async InstallPackage(installInfo: { extensions: string[], localPath?: string, global?: boolean, isSave?: boolean }, logger = console as any) {
    let cmds = [] as string[][]
    const { extensions = [], localPath = join(__dirname, '../../../'), global, isSave } = installInfo
    if (global) {
      cmds = [
        ['yarn', 'global', 'add', ...extensions],
        ['npm', 'install', '-g', ...extensions],
      ]
    } else {
      cmds = [
        ['yarn', 'add', '--prefix', localPath, ...extensions].filter(e => e),
        ['npm', 'install', `${!isSave ? '--no-save' : ''}`, '--prefix', join(localPath, 'node_modules'), ...extensions].filter(e => e),
      ]
      if (!isSave) cmds.reverse()
    }
    let isDone: boolean
    for (const cmd of cmds) {
      try {
        await Exec.Run(cmd, logger)
        logger.log(chalk.green(`✅ Added extensions successfully`))
        console.group()
        extensions.forEach(e => console.log(chalk.green(`- ${e}`)))
        console.groupEnd()
        isDone = true
        break
      } catch { }
    }
    if (!isDone) {
      throw new Error(`Could not install "${extensions}" to ${global ? 'global' : `"${localPath}"`}`)
    }
  }

  async install(installInfo: { extensions: string[], localPath?: string, global?: boolean, isSave?: boolean }) {
    if (!installInfo) return
    if (!installInfo.localPath) installInfo.localPath = this.scenario.rootDir
    installInfo.localPath = this.scenario.resolvePath(installInfo.localPath)
    installInfo.isSave = !Simulator.IS_RUNNING
    if (!installInfo.global) {
      this.installExtensionPath = join(installInfo.localPath, 'node_modules')
      this.globalExtensionPaths.splice(0, 0, this.installExtensionPath)
    }
    await Extensions.InstallPackage(installInfo, this.scenario.loggerFactory.getLogger())
  }

  private async loadNpmYarnGlobalPaths() {
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
      let succ = ''
      let fail = ''
      sp.stdout.on('data', (m) => {
        succ += m.toString()
      })
      sp.stderr.on('data', (m) => {
        fail += m.toString()
      })
      sp.once('close', (code) => {
        if (!code) {
          resolve(succ)
        } else {
          reject(new Error(fail))
        }
      })
    })

  }

}