import { Helper } from "./Helper";
import { VarManager } from "./singleton/VarManager";
import { TestCase } from "./TestCase";

export class Main {

  private static helper = new Helper();

  private static loadEnv() {
    this.helper.loadEnv(VarManager.Instance.globalVars, TestCase.Instance.resolvePath(this.helper.envFile), process.env, this.helper.env)
  }

  static async exec() {

    await this.helper.exec()

    const tc = TestCase.Instance
    try {
      await tc.init(this.helper.yamlFile)
      await tc.prepare()
      this.loadEnv()
      await tc.exec()
    } finally {
      tc.printLog()
      await tc.dispose()
    }
  }
}

Main.exec()

// (async () => {
//   await Main.exec()
// })()

// setTimeout(() => this.exec(), 2000)