import { Helper } from "./Helper";
import { Scenario } from "./singleton/Scenario";
import { VarManager } from "./singleton/VarManager";

export class Main {

  private static helper = new Helper();

  private static loadEnv() {
    this.helper.loadEnv(VarManager.Instance.vars, Scenario.Current.resolvePath(this.helper.envFile), process.env, this.helper.env)
  }

  static async Exec() {

    await this.helper.exec()

    const scenario = Scenario.Current
    try {
      await scenario.init(this.helper.yamlFile)
      await scenario.prepare()
      if (scenario.hasEnvVar) {
        this.loadEnv()
      }
      await scenario.exec()
    } finally {
      scenario.printLog()
      await scenario.dispose()
    }
  }
}

Main.Exec()
