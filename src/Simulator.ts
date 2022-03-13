import { existsSync, unlinkSync, writeFileSync } from "fs";
import { merge } from "lodash";
import { tmpdir } from "os";
import { join } from "path";
import { Scenario } from "./singleton/Scenario";

export class Simulator {

  static async Run(steps: string, env?: any, logLevel = 'error' as any) {
    const scenario = new Scenario()
    scenario.loggerFactory.setLogger(undefined, logLevel)
    const tmpFile = join(tmpdir(), Date.now() + '_' + Math.random() + ".yaml")
    try {
      writeFileSync(tmpFile, steps)

      await scenario.init(tmpFile)
      await scenario.prepare()
      if (env) merge(scenario.variableManager.vars, env)
      await scenario.exec()
    } finally {
      await scenario.dispose()
      if (existsSync(tmpFile)) unlinkSync(tmpFile)
    }
    return scenario
  }
}
