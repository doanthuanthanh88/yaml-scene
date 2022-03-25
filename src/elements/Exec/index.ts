import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';

/**
 * @guide
 * @name Exec
 * @group External
 * @description Execute external command
 * @example
- Exec:
    title: Show yarn global directories
    args:
      - yarn
      - global
      - dir
    var:                                  # Get log content or exit code
      logContent: ${$.messages}           # `$` is referenced to `Exec` element
      exitCode: ${$.code}                
 * @end
 */
export default class Exec implements IElement {
  proxy: ElementProxy<Exec>

  title: string
  args: string[]
  var: string | { [key: string]: any }
  code: number
  messages: string
  opts: any

  private _prc: ChildProcessWithoutNullStreams

  constructor() {
    this.opts = { stdio: 'inherit' }
  }

  init(props: any) {
    merge(this, props)
  }

  prepare() {
    if (this.title) this.title = this.proxy.getVar(this.title)
    if (this.opts) this.opts = this.proxy.getVar(this.opts)
    if (!this.args) this.args = []
    this.args = this.proxy.getVar(this.args)
  }

  exec() {
    if (this.title) this.proxy.logger.info(this.title)
    const [cmd, ...args] = this.args
    this._prc = spawn(cmd, args, this.opts)
    return new Promise<string>((resolve) => {
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
      this._prc.on('close', code => {
        this.code = code
        if (this.var) {
          this.messages = msgs?.join('\n')
          this.proxy.setVar(this.var)
        }
        this._prc = null
        resolve(!code ? this.messages : null)
      })
    })
  }

  dispose() {
    this._prc?.kill()
  }

}