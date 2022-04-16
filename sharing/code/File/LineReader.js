/*****
 * LineReader
 * @example
extensions:
  LineReader: https://raw.githubusercontent.com/doanthuanthanh88/yaml-scene/main/sharing/code/File/LineReader.js
steps:
  - LineReader:
      path: Path_of_file
      onEachLine: !function |
        ({ file, list, $, $$remind, lastSummary, newEvent, isStart }) {
          return async (line, isFinished) => {
            console.log(line, isFinished)
          }
        }
 */
exports.default = class LineReader {
  init(props = {}) {
    this.path = props.path
    const { Functional } = require(this.proxy.resolvePath('#/tags/model/Functional'))
    this.onEachLine = Functional.GetFunction(props.onEachLine)
  }

  async prepare() {
    await this.proxy.applyVars(this, 'path')
    this.path = this.proxy.resolvePath(this.path)
    if (!this.path) throw new Error(`File "${this.path}" is not found`)
  }

  async exec() {
    await new Promise(async (resolve) => {
      const { Resource } = require(this.proxy.resolvePath('#/elements/File/adapter/Resource'))
      const stream = new Resource(this.path, { readType: 'stream' })
      const rl = require('readline').createInterface({
        input: await stream.read()
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