import { TimeUtils } from "@app/utils/TimeUtils";
import chalk from "chalk";
import { Scenario } from ".";
import { LoggerManager } from "../LoggerManager";

export class ScenarioMonitor {
  static Attach(scenario: Scenario) {
    const executeTime = {
      init: 0,
      prepare: 0,
      exec: 0,
      dispose: 0
    }
    scenario.events
      .once('scenario.init', ({ time }) => {
        executeTime.init = time
      })
      .once('scenario.prepare', ({ time }) => {
        executeTime.prepare = time
      })
      .once('scenario.exec', ({ time }) => {
        executeTime.exec = time
      })
      .once('scenario.dispose', ({ time }) => {
        executeTime.dispose = time
      })
      .once('scenario.end', ({ time, isPassed }) => {
        if (isPassed) {
          const msg = []
          msg.push('\n')
          msg.push(chalk.bgBlue.white(` Total ${TimeUtils.Pretty(time - executeTime.init)} `))
          msg.push(chalk.bgCyan.white(` `))
          msg.push(chalk.bgWhite.gray(` Init ${TimeUtils.Pretty(executeTime.prepare - executeTime.init)} `))
          msg.push(chalk.bgYellow.gray(` Prepare ${TimeUtils.Pretty(executeTime.exec - executeTime.prepare)} `))
          msg.push(chalk.bgGreen.white(` Execute ${TimeUtils.Pretty(executeTime.dispose - executeTime.exec)} `))
          msg.push(chalk.bgGray.white(` Dispose ${TimeUtils.Pretty(time - executeTime.dispose)} `))
          msg.push('\n')
          LoggerManager.GetLogger().info(msg.join(''))
        }
      })
  }
}