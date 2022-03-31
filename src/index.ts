import chalk from "chalk";
import { CLI } from "./cli/CLI";
import { ElementFactory } from "./elements/ElementFactory";
import { LoggerManager } from "./singleton/LoggerManager";
import { Scenario } from "./singleton/Scenario";
import { ScenarioMonitor } from "./singleton/Scenario/ScenarioMonitor";
import { VariableManager } from "./singleton/VariableManager";
import { ExtensionNotFound } from "./utils/error/ExtensionNotFound";
import { TraceError } from "./utils/error/TraceError";
import './utils/RequireModule';

export class Main {

  private static printLogo() {
    console.log(`
█▄█ ▄▀█ █▀▄▀█ █░░ ▄▄ █▀ █▀▀ █▀▀ █▄░█ █▀▀
░█░ █▀█ █░▀░█ █▄▄ ░░ ▄█ █▄▄ ██▄ █░▀█ ██▄ v${CLI.Instance.version}
        
`)
  }

  static async Exec() {
    let isRun: boolean
    do {
      this.printLogo()
      try {
        if (isRun === undefined) {
          isRun = await CLI.Instance.exec()
        }
        if (!isRun) return
        isRun = false
        ScenarioMonitor.Attach(Scenario.Instance)
        await Scenario.Instance.init(CLI.Instance.yamlFile, CLI.Instance.password)
        await Scenario.Instance.prepare()
        if (Scenario.Instance.hasEnvVar) {
          CLI.Instance.loadEnv(VariableManager.Instance.vars, Scenario.Instance.resolvePath(CLI.Instance.envFile), process.env, CLI.Instance.env)
        }
        await Scenario.Instance.exec()
      } catch (err: any) {
        if (err instanceof ExtensionNotFound) {
          const [extensionName] = err.extensionName.split("/")
          LoggerManager.GetLogger().warn(chalk.yellow('⚠️', err.message))
          const isContinue = await CLI.Instance.installExtensions([extensionName], err.scope, CLI.Instance.force)
          if (isContinue) {
            let continuePlay = CLI.Instance.force
            if (!continuePlay) {
              LoggerManager.GetLogger().info()
              const confirmContinue = ElementFactory.CreateElement('UserInput')
              confirmContinue.init([{
                title: `Replay the scenario ?`,
                type: 'confirm',
                default: true,
                var: 'continuePlay'
              }])
              await confirmContinue.prepare()
              const confirmContinueValue = await confirmContinue.exec()
              continuePlay = confirmContinueValue.continuePlay
              await confirmContinue.dispose()
            }
            if (continuePlay) {
              isRun = true
              Scenario.Instance.reset()
              continue
            }
          }
        }
        throw err
      } finally {
        await Scenario.Instance.dispose()
      }
    } while (isRun)
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
