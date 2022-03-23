import { spawnSync } from "child_process"

export class Exec {
  static Run(cmds = [] as string[], isShow = true) {
    const [cmd, ...args] = cmds
    return spawnSync(cmd, args, !isShow ? undefined : { stdio: 'inherit' })
  }
}