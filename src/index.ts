import { Helper } from "./Helper";
import { Scenario } from "./singleton/Scenario";

export class Main {

  private static helper = new Helper();

  static async Exec() {

    await this.helper.exec()

    const scenario = new Scenario()
    scenario.loggerFactory.setLogger(undefined, 'info')
    try {
      await scenario.init(this.helper.yamlFile, this.helper.password)
      await scenario.prepare()
      if (scenario.hasEnvVar) {
        this.helper.loadEnv(scenario.variableManager.vars, scenario.resolvePath(this.helper.envFile), process.env, this.helper.env)
      }
      await scenario.exec()
    } finally {
      scenario.printLog()
      await scenario.dispose()
    }
    return scenario
  }
}

Main.Exec()
