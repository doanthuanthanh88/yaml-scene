const { join } = require('path')
const { Functional } = require(join(require.main.path, '..', 'src/tags/model/Functional'))

/*****
 * LineReader
 * @example
extensions:
  LineReader: https://raw.githubusercontent.com/doanthuanthanh88/yaml-scene/main/sharing/code/File/LineReader.js
steps:
  - LineReader:
      path: Path_of_file
      onEachLine: !function |
        ({ file, list, $, $$remind, lastSummary, newEvent, isStart })
        async (line, isFinished) => {
          console.log(line, isFinished)
        }
 */
exports.default = class LineReader {
  init(props = {}) {
    this.path = props.path
    this.onEachLine = Functional.GetFunction(props.onEachLine)
  }

  async prepare() {
    await this.proxy.applyVars(this, 'path')
    this.path = this.proxy.resolvePath(this.path)
  }

  async exec() {
    await new Promise(async (resolve) => {
      const rl = require('readline').createInterface({
        input: require('fs').createReadStream(this.path)
      })
      const func = await this.proxy.eval(this.onEachLine.toReturn())
      rl.on('line', async (line) => {
        await func(line)
      })
      rl.on('close', async () => {
        await func(undefined, true)
        resolve()
      })
    })
  }
}