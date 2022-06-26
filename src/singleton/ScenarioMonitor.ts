import { TimeUtils } from "@app/utils/TimeUtils";
import chalk from "chalk";
import { LoggerManager } from "./LoggerManager";
import { Scenario } from "./Scenario";
import { ScenarioEvent } from "./ScenarioEvent";

export class ScenarioMonitor {
  constructor(public scenario: Scenario) {

  }

  monitor() {
    const executeTime = {
      init: 0,
      prepare: 0,
      exec: 0,
      dispose: 0
    }
    this.scenario.events
      .on(ScenarioEvent.INIT, ({ time }) => {
        executeTime.init = time
      })
      .on(ScenarioEvent.PREPARE, ({ time }) => {
        executeTime.prepare = time
      })
      .on(ScenarioEvent.EXEC, ({ time }) => {
        executeTime.exec = time
      })
      .on(ScenarioEvent.DISPOSE, ({ time }) => {
        executeTime.dispose = time
      })
      .on(ScenarioEvent.END, ({ time, isPassed }) => {
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