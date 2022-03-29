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
      .once('scenario.dispose', ({ time, isPassed }) => {
        executeTime.dispose = time
        if (isPassed) {
          console.group('Time summary')
          LoggerManager.GetLogger().info('- Initting', executeTime.prepare - executeTime.init, 'ms')
          LoggerManager.GetLogger().info('- Preparing', executeTime.exec - executeTime.prepare, 'ms')
          LoggerManager.GetLogger().info('- Executing', executeTime.dispose - executeTime.exec, 'ms')
          LoggerManager.GetLogger().info('- Dispose', Date.now() - executeTime.dispose, 'ms')
          console.groupEnd()
        }
      })
  }
}