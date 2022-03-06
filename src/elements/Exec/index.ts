import chalk from 'chalk';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { merge } from 'lodash';
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';

/**
 * Exec
 * @group External
 * @description Execute external command
 * @example
- Exec:
    title: Show yarn global directories
    args:
      - yarn
      - global
      - dir
 */
export class Exec implements IElement {
  proxy: ElementProxy<Exec>

  title: string
  args: string[]
  var: string | { [key: string]: any }
  code: number
  log: string[]
  success: string[]
  prc: ChildProcessWithoutNullStreams
  detached: boolean
  shell: boolean | string
  slient: boolean

  init(props: any) {
    merge(this, props)
  }

  prepare() {
    if (this.title) this.title = this.proxy.getVar(this.title)
    if (!this.args) this.args = []
    this.args = this.proxy.getVar(this.args)
  }

  exec() {
    if (this.title) console.log(this.title)
    const [cmd, ...args] = this.args
    this.prc = spawn(cmd, args, {
      shell: this.shell,
      detached: !!this.detached
    })
    const msgs = []
    this.prc.stdout.on('data', msg => {
      const _msg = msg.toString()
      if (!this.slient) console.log(chalk.gray(_msg))
      msgs.push(_msg)
    })
    this.prc.stderr.on('data', err => {
      if (!this.slient) console.error(err.toString())
    })
    return new Promise<string>((resolve) => {
      this.prc.on('close', code => {
        resolve(!code ? msgs.join('\n') : null)
      })
    })
  }

  dispose() {
    this.prc?.kill()
  }

}