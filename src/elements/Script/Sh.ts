import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { writeFileSync } from "fs";
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
      echo ${$._tempFile}
      echo ${name}
      echo $1
      echo $2

- Script/Sh:
    title: My command
    args:                           # Custom run script
      - sh                          # Executor
      - ${$._tempFile}               # Temp script file which includes content script and is removed after done
    content: |                      # Content script
      echo ${$._tempFile}            # `$` is referenced to `Sh` element in `Script`
      echo ${name}
      echo $1
      echo $2
 * @end
 */
export default class Sh extends Exec {
  bin: string
  content: string
  mode: number

  private _tempFile: string

  constructor() {
    super()
    this.mode = 777
    this.bin = 'sh'
    this._tempFile = join(tmpdir(), Date.now() + '_' + Math.random() + '.sh')
  }

  init(props: any) {
    this.args = []
    if (typeof props === 'string') {
      this.content = props
    } else {
      super.init(props)
    }
  }

  async prepare() {
    await super.prepare()
    await this.proxy.applyVars(this, 'content')
    if (!this.content) throw new TraceError('Shell script is required')
    if (!this.args?.length) {
      this.args = [this.bin, `${this._tempFile}`]
    }
    writeFileSync(this._tempFile, this.content, {
      mode: this.mode
    })
  }

  dispose() {
    FileUtils.RemoveFilesDirs(this._tempFile)
    return super.dispose()
  }

}