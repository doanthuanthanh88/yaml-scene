import { existsSync, unlinkSync, writeFileSync } from "fs";
import merge from "lodash.merge";
import { tmpdir } from "os";
import { join } from "path";
import { Scenario } from "./singleton/Scenario";

export class Simulator {

  static IS_RUNNING = false

  static async Run(steps = `steps: []`, opts = {} as {
    env?: any,
    logLevel?: string,
    password?: string,
    listener?: { onCreated: (scenario: Scenario) => any }
  }) {
    Simulator.IS_RUNNING = true
    const { env, logLevel = 'error', password, listener } = opts

    const scenario = new Scenario()
    await scenario.setup()
    scenario.loggerFactory.setLogger(undefined, logLevel)
    const tmpFile = join(tmpdir(), Date.now() + '_' + Math.random() + ".yas.yaml")
    try {
      writeFileSync(tmpFile, steps)

      await listener?.onCreated(scenario)

      await scenario.init(tmpFile, password)
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
