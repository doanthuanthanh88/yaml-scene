import { writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { CLI } from "./cli/CLI";
import { LoggerManager } from "./singleton/LoggerManager";
import { Scenario } from "./singleton/Scenario";
import { ExtensionNotFound } from "./utils/error/ExtensionNotFound";
import { FileUtils } from "./utils/FileUtils";

export class Simulator {

  static IS_RUNNING = false

  static async Run(steps = `steps: []`, opts = {} as {
    env?: any,
    logLevel?: string,
    password?: string,
  }) {
    Simulator.IS_RUNNING = true
    const { env, logLevel = 'error', password } = opts
    CLI.Instance.env = env
    LoggerManager.SetDefaultLoggerLevel(logLevel)
    const tmpFile = join(tmpdir(), Date.now() + '_' + Math.random() + ".yas.yaml")
    try {
      writeFileSync(tmpFile, steps)
      let isRun: boolean
      do {
        isRun = false
        try {
          Scenario.Reset()
          Scenario.Instance.init({
            file: tmpFile,
            password,
            logLevel
          })
          await Scenario.Instance.exec()
        } catch (err: any) {
          if (err instanceof ExtensionNotFound) {
            const [extensionName] = err.extensionName.split("/")
            const isContinue = await CLI.Instance.installExtensions([extensionName], err.localPath, err.scope, true)
            if (isContinue) {
              isRun = true
              continue
            }
          }
          throw err
        } finally {
          await Scenario.Instance.dispose()
        }
      } while (isRun)
    } finally {
      FileUtils.RemoveFilesDirs(tmpFile)
    }
  }

}
