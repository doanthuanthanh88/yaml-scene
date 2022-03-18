import { existsSync, unlinkSync, writeFileSync } from "fs";
import merge from "lodash.merge";
import { tmpdir } from "os";
import { join } from "path";
import { Scenario } from "./singleton/Scenario";

export class Simulator {

  static async Run(steps = `steps: []`, env?: any, logLevel: any = 'error', listener?: { onCreated: (scenario: Scenario) => any }) {
    const scenario = new Scenario()
    scenario.loggerFactory.setLogger(undefined, logLevel)
    const tmpFile = join(tmpdir(), Date.now() + '_' + Math.random() + ".yaml")
    try {
      writeFileSync(tmpFile, steps)

      await listener?.onCreated(scenario)

      await scenario.init(tmpFile)
      await scenario.prepare()
      if (env) merge(scenario.variableManager.vars, env)
      await scenario.exec()
    } catch (err) {
      scenario.loggerFactory.getLogger().error(err)
      throw err
    } finally {
      await scenario.dispose()
      if (existsSync(tmpFile)) unlinkSync(tmpFile)
    }
    return scenario
  }

}
