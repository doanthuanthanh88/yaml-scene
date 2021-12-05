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
      tc.time.begin = Date.now()
      await tc.init(this.helper.yamlFile)
      await tc.prepare()
      this.loadEnv()
      await tc.exec()
    } finally {
      await tc.dispose()
      tc.time.end = Date.now()
      console.group('Time summary')
      console.log('- Initting', tc.time.prepare - tc.time.init, 'ms')
      console.log('- Preparing', tc.time.exec - tc.time.prepare, 'ms')
      console.log('- Executing', tc.time.dispose - tc.time.exec, 'ms')
      console.log('- Dispose', tc.time.end - tc.time.dispose, 'ms')
      console.groupEnd()
    }
  }
}

Main.exec()

// (async () => {
//   await Main.exec()
// })()

// setTimeout(() => this.exec(), 2000)