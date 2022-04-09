import { Simulator } from "@app/Simulator"
import { FileUtils } from "@app/utils/FileUtils"
import { existsSync, readFileSync } from "fs"

describe('Test scripts', () => {
  const tmpFile = FileUtils.GetNewTempPath('.txt')

  afterAll(() => {
    FileUtils.RemoveFilesDirs(tmpFile)
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