import { Simulator } from "@app/Simulator"
import { FileUtils } from "@app/utils/FileUtils"
import { existsSync, readFileSync } from "fs"

describe('Test scripts', () => {
  const tmpFile = FileUtils.GetNewTempPath('.txt')

  afterAll(() => {
    FileUtils.RemoveFilesDirs(tmpFile)
  })

  test('Run nodejs code', async () => {
    await Simulator.Run(`
- Vars:
    text: Hello world
    
- Script/Js: 
    title: Write hello 1
    content: !function |
      ({ text }) {
        require('fs').writeFileSync('${tmpFile}', text + ' 1')
      }

- Script/Js: !function |
    ({ text }) {
      require('fs').writeFileSync('${tmpFile}', text)
    }
`)
    expect(existsSync(tmpFile)).toBe(true)
    expect(readFileSync(tmpFile).toString()).toBe('Hello world')
  })

})