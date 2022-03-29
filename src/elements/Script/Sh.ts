import { TraceError } from "@app/utils/error/TraceError";
import { existsSync, writeFileSync } from "fs";
import { unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import Exec from "../Exec";

/**
 * @guide
 * @name Script/Sh
 * @description Embed shell script into scene
 * @group External
 * @example
- Vars:
    name: 'thanh'

### Short
- Script/Sh: |
    echo '${name}'
    yarn global dir

### Full
- Script/Sh:
    title: My command               # Job title
    bin: sh                         # Path to executor
    mode: 777                       # chmod 
    content: |                      # Content script
      echo ${$.tempFile}
      echo ${name}
      echo $1
      echo $2

- Script/Sh:
    title: My command
    args:                           # Custom run script
      - sh                          # Executor
      - ${$.tempFile}               # Temp script file which includes content script and is removed after done
    content: |                      # Content script
      echo ${$.tempFile}            # `$` is referenced to `Sh` element in `Script`
      echo ${name}
      echo $1
      echo $2
 * @end
 */
export default class Sh extends Exec {
  bin: string
  content: string
  mode: number

  tempFile: string

  constructor() {
    super()
    this.mode = 777
    this.bin = 'sh'
  }

  init(props: any) {
    this.tempFile = join(tmpdir(), Date.now() + '_' + Math.random() + '.sh')
    this.args = []
    if (typeof props === 'string') {
      this.content = props
    } else {
      super.init(props)
    }
  }

  prepare() {
    this.content = this.proxy.getVar(this.content)
    this.args = this.proxy.getVar(this.args)
    if (!this.content) throw new TraceError('Shell script is required')
    if (!this.args?.length) {
      this.args = [this.bin, `${this.tempFile}`]
    }
    writeFileSync(this.tempFile, this.content, {
      mode: this.mode
    })
    return super.prepare()
  }

  async dispose() {
    await Promise.all([
      existsSync(this.tempFile) && unlink(this.tempFile),
      super.dispose()
    ])
  }

}