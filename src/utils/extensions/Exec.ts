import { spawn } from "child_process"

export class Exec {
  static Run(cmds = [] as string[], logger = console as any) {
    const [cmd, ...args] = cmds
    const prc = spawn(cmd, args)
    return new Promise((resolve) => {
      prc.stdout.on('data', msg => {
        logger.log(msg.toString())
      })
      prc.stderr.on('data', err => {
        logger.error(err.toString())
      })
      prc.on('close', code => {
        resolve(code)
      })
    })
  }
}