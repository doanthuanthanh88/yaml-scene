import { existsSync, unlinkSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { LoggerManager } from "./singleton/LoggerManager";
import { Scenario } from "./singleton/Scenario";
import { VariableManager } from "./singleton/VariableManager";

export class Simulator {

  static IS_RUNNING = false

  static async Run(steps = `steps: []`, opts = {} as {
    env?: any,
    logLevel?: string,
    password?: string,
  }) {
    Simulator.IS_RUNNING = true
    const { env, logLevel = 'error', password } = opts

    LoggerManager.SetDefaultLoggerLevel(logLevel)
    const tmpFile = join(tmpdir(), Date.now() + '_' + Math.random() + ".yas.yaml")
    try {
      writeFileSync(tmpFile, steps)

      Scenario.Instance?.reset()
      await Scenario.Instance.init(tmpFile, password)
      await Scenario.Instance.prepare()
      VariableManager.Instance.init(env)
      await Scenario.Instance.exec()
    } catch (err) {
      LoggerManager.GetLogger().error(err)
      throw err
    } finally {
      if (existsSync(tmpFile)) unlinkSync(tmpFile)
      await Scenario.Instance?.dispose()
    }
  }

}
