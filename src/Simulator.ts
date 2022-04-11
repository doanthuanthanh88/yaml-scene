import { writeFileSync } from "fs";
import { CLI } from "./cli/CLI";
import { LoggerManager } from "./singleton/LoggerManager";
import { Scenario } from "./singleton/Scenario";
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
    const tmpFile = FileUtils.GetNewTempPath('.yas.yaml')
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
        } finally {
          await Scenario.Instance.dispose()
        }
      } while (isRun)
    } finally {
      FileUtils.RemoveFilesDirs(tmpFile)
    }
  }

}
