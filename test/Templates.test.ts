import { Simulator } from "@app/Simulator"
import { existsSync, readFileSync, unlinkSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

describe('Test element Templates', () => {
  const path = join(tmpdir(), Math.random() + 'data.xlsx')

  afterAll(() => {
    existsSync(path) && unlinkSync(path)
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