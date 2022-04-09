import { Simulator } from "@app/Simulator"
import { FileUtils } from "@app/utils/FileUtils"
import { existsSync } from "fs"
import { join } from "path"


describe('Fragment', () => {
  const file = FileUtils.GetNewTempPath('.txt')

  afterAll(() => {
    FileUtils.RemoveFilesDirs(file)
  })

  test('Execute fragment', async () => {
    await Simulator.Run(`
- Vars:
    file: ${file}

- Fragment: 
    file: ${join(__dirname, 'write')}
    password: example
  `)

    expect(existsSync(file)).toBe(true)

  })
})

describe('Fragment with password', () => {
  const file = FileUtils.GetNewTempPath('.txt')

  afterAll(() => {
    FileUtils.RemoveFilesDirs(file)
  })

  test('Execute fragment with encrypted scenario file', async () => {
    await Simulator.Run(`
- Vars:
    file: ${file}

- Fragment: 
    file: ${join(__dirname, 'write')}
    password: example

`)

    expect(existsSync(file)).toBe(true)

  })
})