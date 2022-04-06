import { Simulator } from "@app/Simulator"
import { FileUtils } from "@app/utils/FileUtils"
import { existsSync, readFileSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

const path = join(tmpdir(), Math.random().toString())
const arr = [1, 2, 3]

afterAll(() => {
  for (const i in arr) {
    const p = `${path}_${i}`
    FileUtils.RemoveFilesDirs(p)
  }
})

test('Loop', async () => {
  await Simulator.Run(`
- File/Writer:
    loop: [${arr}]
    path: ${path}_\${$.loopKey}
    content: Hello \${$.loopValue}
`)
  for (const i in arr) {
    const p = `${path}_${i}`
    expect(existsSync(p)).toBe(true)
    expect(readFileSync(p).toString()).toBe('Hello ' + arr[i])
  }

})