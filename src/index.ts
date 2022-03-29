import chalk from "chalk";
import { CLI } from "./cli/CLI";
import { ElementFactory } from "./elements/ElementFactory";
import { LoggerManager } from "./singleton/LoggerManager";
import { Scenario } from "./singleton/Scenario";
import { ScenarioMonitor } from "./singleton/Scenario/ScenarioMonitor";
import { VariableManager } from "./singleton/VariableManager";
import { ExtensionNotFound } from "./utils/error/ExtensionNotFound";
import { TraceError } from "./utils/error/TraceError";

export class Main {

  static async Exec() {

    const helper = new CLI()
    let isRun = await helper.exec()

    while (isRun) {
      isRun = false
      try {
        ScenarioMonitor.Attach(Scenario.Instance)
        await Scenario.Instance.init(helper.yamlFile, helper.password)
        await Scenario.Instance.prepare()
        if (Scenario.Instance.hasEnvVar) {
          helper.loadEnv(VariableManager.Instance.vars, Scenario.Instance.resolvePath(helper.envFile), process.env, helper.env)
        }
        await Scenario.Instance.exec()
      } catch (err: any) {
        if (!(err instanceof ExtensionNotFound)) throw err
        const [extensionName] = err.extensionName.split("/")
        LoggerManager.GetLogger().warn(chalk.yellow('⚠️', `The scenario is using a new element "${err.extensionName}"`))
        const isContinue = await helper.installExtensions([extensionName])
        if (isContinue) {
          LoggerManager.GetLogger().info()
          const confirmContinue = ElementFactory.CreateElement('UserInput')
          confirmContinue.init([{
            title: `Keep playing the scenario ?`,
            type: 'confirm',
            default: true,
            var: 'continuePlay'
          }])
          confirmContinue.prepare()
          const { continuePlay } = await confirmContinue.exec()
          await confirmContinue.dispose()

          if (continuePlay) {
            isRun = true
            Scenario.Instance.reset()
            console.clear()
          } else {
            isRun = false
          }
        }
      } finally {
        await Scenario.Instance.dispose()
      }
    }
  }
}

(async () => {
  try {
    await Main.Exec()
  } catch (err) {
    if (err instanceof TraceError && err.info) {
      console.group('TraceErrorData:')
      console.log(JSON.stringify(err.info, null, '  '))
      console.groupEnd()
    }
    throw err
  }
})()
