import chalk from "chalk";
import { ElementFactory } from "./elements/ElementFactory";
import { Helper } from "./Helper";
import { Scenario } from "./singleton/Scenario";
import { ExtensionNotFound } from "./utils/error/ExtensionNotFound";

export class Main {

  static async Exec() {

    const helper = new Helper(new Scenario())
    let isRun = await helper.exec()

    let scenario: Scenario

    while (isRun) {
      isRun = false
      scenario = new Scenario()
      scenario.loggerFactory.setLogger(undefined, 'info')
      try {
        await scenario.init(helper.yamlFile, helper.password)
        await scenario.prepare()
        if (scenario.hasEnvVar) {
          helper.loadEnv(scenario.variableManager.vars, scenario.resolvePath(helper.envFile), process.env, helper.env)
        }
        await scenario.exec()
        scenario.printLog()
      } catch (err: any) {
        if (!(err instanceof ExtensionNotFound)) throw err
        const [extensionName] = err.extensionName.split("/")
        console.log(chalk.yellow('⚠️', `The scenario is using the element "${err.extensionName}"`))
        const confirm = ElementFactory.CreateElement('UserInput', scenario)
        confirm.init([{
          title: `Do you want to install the extension "${extensionName}" ?`,
          type: 'confirm',
          default: true,
          var: 'isInstallExtension'
        }])
        confirm.prepare()
        const { isInstallExtension } = await confirm.exec()
        await confirm.dispose()

        if (!isInstallExtension) throw err
        await helper.installExtensions([extensionName])

        console.log()
        const confirmContinue = ElementFactory.CreateElement('UserInput', scenario)
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
          console.clear()
        } else {
          isRun = false
        }
      } finally {
        await scenario.dispose()
      }
    }
    return scenario
  }
}

(async () => {
  try {
    await Main.Exec()
  } catch (err) {
    console.error(chalk.red(err.message))
    throw err
  }
})()
