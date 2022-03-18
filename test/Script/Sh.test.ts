import { Simulator } from "@app/Simulator"
import { existsSync, readFileSync, unlinkSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

describe('Test scripts', () => {
  const tmpFile = join(tmpdir(), Math.random().toString())

  afterAll(() => {
    unlinkSync(tmpFile)
  })

  test('Run shell script', async () => {

    await Simulator.Run(`
- Script/Sh: |
    echo "Hello world" > "${tmpFile}"
`)
    expect(existsSync(tmpFile)).toBe(true)
    expect(readFileSync(tmpFile).toString().trim()).toBe('Hello world')
  })

})