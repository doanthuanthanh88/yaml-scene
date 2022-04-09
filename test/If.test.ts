import { Simulator } from "@app/Simulator"
import { FileUtils } from "@app/utils/FileUtils"
import { existsSync, readFileSync } from "fs"

const path = FileUtils.GetNewTempPath()
const arr = [1, 2, 3]

afterAll(() => {
  const i = 1
  const p = `${path}_${i}`
  FileUtils.RemoveFilesDirs(p)
})

test('Conditional', async () => {
  await Simulator.Run(`
- Group:
    loop: [${arr}]
    steps:
      - File/Writer:
          if: \${$$.loopKey == '1'}
          path: ${path}_\${$$.loopKey}
          content: Hello \${$$.loopValue}
`)
  for (const i in arr) {
    const p = `${path}_${i}`
    expect(existsSync(p)).toBe(i == '1')
    if (i == '1') {
      expect(readFileSync(p).toString()).toBe('Hello ' + arr[i])
    }
  }

})