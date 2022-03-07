import { existsSync, unlinkSync, writeFileSync } from "fs";
import { merge } from "lodash";
import { setDefaultLevel } from "loglevel";
import { tmpdir } from "os";
import { join } from "path";
import { Scenario } from "./singleton/Scenario";
import { VarManager } from "./singleton/VarManager";

export class Simulator {

  static async Run(steps: string, env?: any, logLevel = 'error' as any) {
    setDefaultLevel(logLevel)

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
