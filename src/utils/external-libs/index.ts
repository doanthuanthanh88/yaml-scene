import chalk from "chalk";
import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export class ExternalLibs {
  // private static ExternalModules = new Set<string>()
  private static ExternalElements = {}
  public static LibPaths = new Array<string>()

  static execShell(cmd: string, args: string[]) {
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

  static async Setup(libDirs: string[]) {
    await ExternalLibs.loadLibPaths(libDirs)
  }

  private static async loadLibPaths(libDirs?: string[]) {
    if (!ExternalLibs.LibPaths.length) {
      if (libDirs) ExternalLibs.LibPaths.push(...libDirs)
      await Promise.all([
        (async () => {
          try {
            const rs = await ExternalLibs.execShell("npm", ["root", "-g"])
            ExternalLibs.LibPaths.push(
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
            const rs = await ExternalLibs.execShell("yarn", ["global", "dir"])
            ExternalLibs.LibPaths.push(
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

  private static getPathGlobalModule(name: string) {
    let modulePath = undefined;
    for (const i in ExternalLibs.LibPaths) {
      modulePath = join(ExternalLibs.LibPaths[i], name);
      try {
        require.resolve(modulePath);
        return modulePath;
      } catch { }
    }
    modulePath = name
    try {
      require.resolve(modulePath);
      return modulePath;
    } catch { }
    throw new Error(
      `Please install module "${name}" \n    \`npm install -g ${name}\` \n OR \n    \`yarn global add ${name}\``
    );
  }

  static loadExternalLib(p: string) {
    // for (const p of modules) {
    if (ExternalLibs.ExternalElements[p]) {
      return ExternalLibs.ExternalElements[p]
    }

    let obj: any;
    let modulePath = "System";
    try {
      modulePath = ExternalLibs.getPathGlobalModule(p);
      obj = require(modulePath);
      ExternalLibs.ExternalElements[p] = obj
      // ExternalLibs.ExternalModules.add(obj);
      try {
        const packageJson = JSON.parse(readFileSync(join(modulePath, 'package.json')).toString())
        console.log(chalk.bold.gray(`${packageJson.name} (v${packageJson.version})`), chalk.gray.underline(packageJson.repository?.url || ''), chalk.italic.gray(`${packageJson.description || ''}`))
      } catch { }
      // console.group()
      // for (let k in obj) {
      //   if (ExternalLibs.ExternalElements[k]) {
      //     console.log(
      //       chalk.yellow(
      //         `Warn: Tag ${k} has declared. Could not redeclare in ${modulePath}`
      //       )
      //     );
      //   }
      //   ExternalLibs.ExternalElements[k] = obj[k];
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
}