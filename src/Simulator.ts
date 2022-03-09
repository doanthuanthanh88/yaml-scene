import { existsSync, unlinkSync, writeFileSync } from "fs";
import { merge } from "lodash";
import { tmpdir } from "os";
import { join } from "path";
import { Scenario } from "./singleton/Scenario";
import { VarManager } from "./singleton/VarManager";
import { LoggerFactory } from "./utils/logger";

export class Simulator {

  static async Run(steps: string, env?: any, logLevel = 'error' as any) {
    if (logLevel === 'slient') {
      LoggerFactory.GetLogger().disableAll()
    } else {
      LoggerFactory.GetLogger().setDefaultLevel(logLevel)
    }

    const scenario = Scenario.Current
    const tmpFile = join(tmpdir(), Date.now() + '_' + Math.random() + ".yaml")
    try {
      writeFileSync(tmpFile, steps)

      await scenario.init(tmpFile)
      await scenario.prepare()
      if (env) merge(VarManager.Instance.vars, env)
      await scenario.exec()
    } finally {
      await scenario.dispose()

      if (existsSync(tmpFile)) unlinkSync(tmpFile)
    }
  }
}
