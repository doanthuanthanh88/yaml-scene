import { spawnSync } from "child_process"

export class Exec {
  static Run(cmds = [] as string[]) {
    const [cmd, ...args] = cmds
    spawnSync(cmd, args)
  }
}