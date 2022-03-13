import { Scenario } from "@app/singleton/Scenario";
import chalk from "chalk";
import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export class Extensions {
  private extensionElements = {}
  public extensionPaths = new Array<string>()

  constructor(public scenario: Scenario) {

  }

  load(p: string) {
    // for (const p of modules) {
    if (this.extensionElements[p]) {
      return this.extensionElements[p]
    }

    let obj: any;
    let modulePath = "System";
    try {
      modulePath = this.getPathGlobalModule(p);
      obj = require(modulePath);
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

  async setup(libDirs: string[]) {
    await this.loadextensionPaths(libDirs?.map(dir => this.scenario.resolvePath(dir)))
  }

  private async loadextensionPaths(libDirs?: string[]) {
    if (!this.extensionPaths.length) {
      if (libDirs) this.extensionPaths.push(...libDirs)
      await Promise.all([
        (async () => {
          try {
            const rs = await this.execShell("npm", ["root", "-g"])
            this.extensionPaths.push(
              ...rs.split('\n')
                .map((f) => f?.trim())
                .filter((f) => f && existsSync(f))
            );
          } catch (err) {
            console.error(err);
          }
        })(),
        (async () => {
          try {
            const rs = await this.execShell("yarn", ["global", "dir"])
            this.extensionPaths.push(
              ...rs.split('\n')
                .map((f) => {
                  f = f?.trim();
                  return f ? join(f, "node_modules") : f;
                })
                .filter((f) => f && existsSync(f))
            );
          } catch (err) {
            console.error(err);
          }
        })(),
      ]);
    }
  }

  private getPathGlobalModule(name: string) {
    let modulePath = undefined;
    for (const i in this.extensionPaths) {
      modulePath = join(this.extensionPaths[i], name);
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
    throw new Error(
      `Please install module "${name}" \n    \`npm install -g ${name}\` \n OR \n    \`yarn global add ${name}\``
    );
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