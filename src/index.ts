import { readFileSync } from "fs";
import { safeLoadAll } from "js-yaml";
import { dirname, resolve } from "path";
import { Helper } from "./Helper";
import { VarManager } from "./singleton/VarManager";
import { SCHEMA } from "./tags";
import { TestCase } from "./TestCase";
import { ExternalLibs } from "./utils/external-libs";

export class Main {

  private static helper = new Helper();

  private static loadEnv() {
    this.helper.loadEnv(VarManager.Instance.globalVars, this.helper.envFile ? TestCase.GetPathFromRoot(this.helper.envFile) : undefined, process.env, this.helper.env)
  }

  static async exec() {

    await this.helper.exec()

    const scenarioFile = this.helper.yamlFile
    TestCase.RootDir = resolve(dirname(this.helper.yamlFile))

    const scenarios = safeLoadAll(readFileSync(scenarioFile).toString(), null, {
      schema: SCHEMA
    })
    for (let scenario of scenarios) {
      if (Array.isArray(scenario)) {
        scenario = { title: scenarioFile, steps: scenario.flat() }
      }
      const { externalLibs, ...testcaseProps } = scenario
      if (externalLibs) {
        await ExternalLibs.Setup(Array.isArray(externalLibs) ? externalLibs : [externalLibs])
      }
      const tc = new TestCase(testcaseProps)
      try {
        tc.time.begin = Date.now()
        tc.init()
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
}

Main.exec()

// (async () => {
//   await Main.exec()
// })()

// setTimeout(() => this.exec(), 2000)