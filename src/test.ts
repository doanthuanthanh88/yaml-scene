import { existsSync, unlinkSync, writeFileSync } from "fs";
import { merge } from "lodash";
import { tmpdir } from "os";
import { join } from "path";
import { Scenario } from "./singleton/Scenario";
import { VarManager } from "./singleton/VarManager";

export class Test {

  static async Exec(steps: string, env?: any) {
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
