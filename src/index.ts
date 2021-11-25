import { readFileSync } from "fs";
import { safeLoadAll } from "js-yaml";
import { merge } from "lodash";
import { dirname } from "path";
import { Helper } from "./Helper";
import { VarManager } from "./singleton/VarManager";
import { SCHEMA } from "./tags";
import { TestCase } from "./TestCase";
import { ExternalLibs } from "./utils/external-libs";

export class Main {

  private static helper = new Helper();

  private static loadEnv() {
    Main.helper.loadEnv(VarManager.Instance.globalVars, Main.helper.envFile ? TestCase.GetPathFromRoot(Main.helper.envFile) : undefined)
    if (Main.helper.env) {
      console.log(VarManager.Instance.globalVars)
      merge(VarManager.Instance.globalVars, Main.helper.env)
      console.log(VarManager.Instance.globalVars)
    }
  }

  static async exec() {

    await Main.helper.exec()

    const scenarioFile = Main.helper.yamlFile
    TestCase.RootDir = dirname(Main.helper.yamlFile)

    const scenarios = safeLoadAll(readFileSync(scenarioFile).toString(), null, {
      schema: SCHEMA
    })
    for (const scenario of scenarios) {
      const { externalLibs, ...testcaseProps } = scenario
      if (externalLibs) {
        await ExternalLibs.Setup(Array.isArray(externalLibs) ? externalLibs : [externalLibs])
      }
      const tc = new TestCase(testcaseProps)
      try {
        tc.time.begin = Date.now()
        tc.init()
        await tc.prepare()
        Main.loadEnv()
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
}

(async () => {
  await Main.exec()
})()

// setTimeout(() => Main.exec(), 2000)