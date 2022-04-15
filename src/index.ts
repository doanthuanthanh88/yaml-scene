import { CLI } from "./cli/CLI";
import { Scenario } from "./singleton/Scenario";
import { TraceError } from "./utils/error/TraceError";
import { FileUtils } from "./utils/FileUtils";

export class Main {

  private static printLogo() {
    console.log(`
█▄█ ▄▀█ █▀▄▀█ █░░ ▄▄ █▀ █▀▀ █▀▀ █▄░█ █▀▀
░█░ █▀█ █░▀░█ █▄▄ ░░ ▄█ █▄▄ ██▄ █░▀█ ██▄ v${CLI.Instance.version}
        
`)
  }

  static async Exec() {
    let isRun: boolean | undefined
    do {
      this.printLogo()
      try {
        if (isRun === undefined) {
          isRun = await CLI.Instance.exec()
          if (!isRun) return
        }
        isRun = false
        Scenario.Instance.init({
          file: CLI.Instance.yamlFile,
          password: CLI.Instance.password
        })
        await Scenario.Instance.exec()
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
      console.error(JSON.stringify(err.info, null, '  '))
      console.groupEnd()
    }
    throw err
  } finally {
    FileUtils.CleanTempPath()
  }
})()
