import { Simulator } from "@app/Simulator"
import { existsSync, unlinkSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"


describe('Fragment', () => {
  const file = join(tmpdir(), Math.random() + '.txt')

  afterAll(() => {
    existsSync(file) && unlinkSync(file)
  })

  test('Execute fragment', async () => {
    await Simulator.Run(`
  - Vars:
      file: ${file}
  
  - Fragment: 
      file: ${join(__dirname, 'write')}
      password: example
  
  `, { logLevel: 'info' })

    expect(existsSync(file)).toBe(true)

  })
})

describe('Fragment with password', () => {
  const file = join(tmpdir(), Math.random() + '.txt')

  afterAll(() => {
    existsSync(file) && unlinkSync(file)
  })

  test('Execute frafment with encrypted scenario file', async () => {
    await Simulator.Run(`
- Vars:
    file: ${file}

- Fragment: 
    file: ${join(__dirname, 'write')}
    password: example

`, { logLevel: 'info' })

    expect(existsSync(file)).toBe(true)

  })
})