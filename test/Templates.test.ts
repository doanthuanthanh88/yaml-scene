import { Simulator } from "@app/Simulator"
import { FileUtils } from "@app/utils/FileUtils"
import { existsSync, readFileSync } from "fs"

describe('Test element Templates', () => {
  const path = FileUtils.GetNewTempPath('.txt')

  afterAll(() => {
    FileUtils.RemoveFilesDirs(path)
  })

  test('Template is an array', async () => {
    await Simulator.Run(`
- Templates:
  - File/Writer:
      ->: fileWriter
      path: ${path}

- File/Writer:
    <-: fileWriter
    content: hello
`)
    expect(existsSync(path)).toBe(true)
    expect(readFileSync(path).toString()).toBe('hello')
  })

  test('Template is an object', async () => {
    await Simulator.Run(`
- Templates:
    fileWriter: 
      File/Writer:
        path: ${path}

- File/Writer:
    <-: fileWriter
    content: hello2
`)
    expect(existsSync(path)).toBe(true)
    expect(readFileSync(path).toString()).toBe('hello2')
  })

})