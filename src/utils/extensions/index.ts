import { Scenario } from "@app/singleton/Scenario";
import chalk from "chalk";
import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export class Extensions {
  private static ExtensionElements = {}
  public static ExtensionPaths = new Array<string>()

  static Load(p: string) {
    // for (const p of modules) {
    if (Extensions.ExtensionElements[p]) {
      return Extensions.ExtensionElements[p]
    }

    let obj: any;
    let modulePath = "System";
    try {
      modulePath = Extensions.GetPathGlobalModule(p);
      obj = require(modulePath);
      Extensions.ExtensionElements[p] = obj
      // Extensions.ExternalModules.add(obj);
      try {
        const packageJson = JSON.parse(readFileSync(join(modulePath, 'package.json')).toString())
        console.log(chalk.bold.gray(`${packageJson.name} (v${packageJson.version})`), chalk.gray.underline(packageJson.repository?.url || ''), chalk.italic.gray(`${packageJson.description || ''}`))
      } catch { }
      // console.group()
      // for (let k in obj) {
      //   if (Extensions.ExtensionElements[k]) {
      //     console.log(
      //       chalk.yellow(
      //         `Warn: Tag ${k} has declared. Could not redeclare in ${modulePath}`
      //       )
      //     );
      //   }
      //   Extensions.ExtensionElements[k] = obj[k];
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

  static async Setup(libDirs: string[]) {
    await Extensions.LoadExtensionPaths(libDirs?.map(dir => Scenario.Current.resolvePath(dir)))
  }

  private static async LoadExtensionPaths(libDirs?: string[]) {
    if (!Extensions.ExtensionPaths.length) {
      if (libDirs) Extensions.ExtensionPaths.push(...libDirs)
      await Promise.all([
        (async () => {
          try {
            const rs = await Extensions.ExecShell("npm", ["root", "-g"])
            Extensions.ExtensionPaths.push(
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
            const rs = await Extensions.ExecShell("yarn", ["global", "dir"])
            Extensions.ExtensionPaths.push(
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

  private static GetPathGlobalModule(name: string) {
    let modulePath = undefined;
    for (const i in Extensions.ExtensionPaths) {
      modulePath = join(Extensions.ExtensionPaths[i], name);
      try {
        require.resolve(modulePath);
        return modulePath;
      } catch { }
    }
    modulePath = Scenario.Current.resolvePath(name)
    try {
      require.resolve(modulePath);
      return modulePath;
    } catch { }
    throw new Error(
      `Please install module "${name}" \n    \`npm install -g ${name}\` \n OR \n    \`yarn global add ${name}\``
    );
  }

  private static ExecShell(cmd: string, args: string[]) {
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