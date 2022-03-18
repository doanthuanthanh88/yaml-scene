import { Simulator } from "@app/Simulator"
import { existsSync, readFileSync, unlinkSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

describe('Test scripts', () => {
  const tmpFile = join(tmpdir(), Math.random().toString())

  afterAll(() => {
    unlinkSync(tmpFile)
  })

  test('Run nodejs code', async () => {
    await Simulator.Run(`
- Script/Js: |
    require('fs').writeFileSync('${tmpFile}', 'Hello world')
`)
    expect(existsSync(tmpFile)).toBe(true)
    expect(readFileSync(tmpFile).toString()).toBe('Hello world')
  })

})