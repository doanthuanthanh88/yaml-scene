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
    args:
      - sh          # Specific path to sh or bash binary
      - ${_.file}   # This content will be writed to this path then execute it
      - arg1
      - arg2
    content: |
      echo ${_.file}
      echo ${name}
      echo $1
      echo $2
 * @end
 */
export default class Sh extends Exec {
  content: string
  bin: string
  file: string
  mode: number

  constructor() {
    super()
    this.mode = 777
  }

  init(props: any) {
    this.file = join(tmpdir(), Date.now() + '_' + Math.random() + '.sh')
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
    if (!this.content) throw new Error('Shell script is required')
    if (!this.args?.length) {
      this.args = ['sh', `${this.file}`]
    }
    const idx = this.args.findIndex(a => a === '${file}')
    if (idx !== -1) {
      this.args[idx] = this.file
    }
    writeFileSync(this.file, this.content, {
      mode: this.mode
    })
    return super.prepare()
  }

  async dispose() {
    await Promise.all([
      existsSync(this.file) && unlink(this.file),
      super.dispose()
    ])
  }

}