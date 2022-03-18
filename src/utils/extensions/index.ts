import { Scenario } from "@app/singleton/Scenario";
import chalk from "chalk";
import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export class Extensions {
  private extensionElements = {}
  private globalExtensionPaths = new Set<string>()
  private localExtensionPaths = {}


  constructor(public scenario: Scenario) { }

  getGlobalExtension(name: string) {
    return this.extensionElements[name]
  }

  load(p: string) {
    // for (const p of modules) {
    if (this.extensionElements[p]) {
      return this.extensionElements[p]
    }

    let obj: any;
    let modulePath = "System";
    try {
      modulePath = this.getPathLocalModule(p) || this.getPathGlobalModule(p);
      if (!modulePath) {
        throw new Error(
          `Please install module "${p}" \n    \`npm install -g ${p}\` \n OR \n    \`yarn global add ${p}\``
        )
      }
      obj = require(modulePath).default;
      this.extensionElements[p] = obj
      // this.ExternalModules.add(obj);
      try {
        const packageJson = JSON.parse(readFileSync(join(modulePath, 'package.json')).toString())
        this.scenario.loggerFactory.getLogger().info(chalk.bold.gray(`${packageJson.name} (v${packageJson.version})`), chalk.gray.underline(packageJson.repository?.url || ''), chalk.italic.gray(`${packageJson.description || ''}`))
      } catch { }
      // console.group()
      // for (let k in obj) {
      //   if (this.extensionElements[k]) {
      //     console.log(
      //       chalk.yellow(
      //         `Warn: Tag ${k} has declared. Could not redeclare in ${modulePath}`
      //       )
      //     );
      //   }
      //   this.extensionElements[k] = obj[k];
      //   console.log(chalk.gray.bold('- ' + k), chalk.italic.gray(`(${modulePath})`));
      // }
      // console.groupEnd()
    } catch (err) {
      console.error(chalk.red(err.message));
      throw err;
    }
    return obj
    // }
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
    globalDirs.forEach(gd => this.globalExtensionPaths.add(gd))
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