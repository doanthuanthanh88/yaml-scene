import { ChildProcessWithoutNullStreams, spawn, spawnSync } from 'child_process';
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';

/*****
@name Exec
@group External
@description Execute external command
@example
- Exec:
    title: Show yarn global directories
    args:
      - yarn
      - global
      - dir
    var:                                  # Get log content or exit code
      logContent: ${$.messages}           # `$` is referenced to `Exec` element
      exitCode: ${$.code}                
*/
export default class Exec implements IElement {
  static Run(cmds: string[] = [], isShow = true) {
    const [cmd, ...args] = cmds
    return spawnSync(cmd, args, !isShow ? undefined : { stdio: 'inherit' })
  }

  proxy: ElementProxy<this>
  $$: IElement
  $: this

  title?: string
  opts?: any
  args: string[]

  var?: string | { [key: string]: any }
  code?: number
  messages?: string

  private _prc?: ChildProcessWithoutNullStreams | null

  constructor() {
    this.opts = { stdio: 'inherit' }
    this.args = []
  }

  init(props: any) {
    merge(this, props)
  }

  async prepare() {
    await this.proxy.applyVars(this, 'title', 'opts', 'args')
  }

  async exec() {
    if (this.title) this.proxy.logger.info(this.title)
    this.title && console.group()
    return new Promise<string | undefined>((resolve, reject) => {
      const [cmd, ...args] = this.args
      this._prc = spawn(cmd, args, this.opts)
      const msgs = this.var ? [] : undefined
      this._prc.stdout?.on('data', msg => {
        const _msg = msg?.toString()
        this.proxy.logger.debug(_msg)
        msgs?.push(_msg)
      })
      this._prc.stderr?.on('data', msg => {
        const _msg = msg?.toString()
        this.proxy.logger.debug(_msg)
        msgs?.push(_msg)
      })
      this._prc
        .on('error', reject)
        .on('close', async code => {
          this.code = code
          if (this.var) {
            this.messages = msgs?.join('\n')
            await this.proxy.setVar(this.var)
          }
          this._prc = null
          resolve(this.messages)
        })
    }).finally(() => {
      this.title && console.groupEnd()
    })
  }

  dispose() {
    this._prc?.kill()
  }

}