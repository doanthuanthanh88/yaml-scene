import { Simulator } from "@app/Simulator"
import { existsSync, unlinkSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

describe.each([
  { type: 'Text', filename: 'data.txt', data: 'Hello world' },
  { type: 'Json', filename: 'data.json', data: { "say": "hello world" } },
  { type: 'Csv', filename: 'data.csv', data: [['label 1', 'label 2', 'label 3', 'label 4'], ['1', '2', '3', '4']] },
  { type: 'Yaml', filename: 'data.yaml', data: { "say": "hello world" } },
  { type: 'Xml', filename: 'data.xml', data: { "say": "hello world" } },
])('Test to "ReadFile" and "WriteFile"', ({ type, filename, data }) => {
  const path = join(tmpdir(), Math.random() + filename)

  afterAll(() => {
    unlinkSync(`${path}`)
    unlinkSync(`${path}.encrypted`)
  })

  test(`Write a ${type} file`, async () => {
    await Simulator.Run(`
- Vars:
    data: ${JSON.stringify(data)}
- WriteFile:
    path: ${path}
    adapters: 
      - ${type}
    content: \${data}
`)
    expect(existsSync(path)).toBe(true)
  })

  test(`Write a ${type} file with password`, async () => {
    await Simulator.Run(`
- Vars:
    data: ${JSON.stringify(data)}
- WriteFile:
    path: ${path}.encrypted
    adapters: 
      - ${type}
      - Password: thanh123
    content: \${data}
`)
    expect(existsSync(path)).toBe(true)
  })

})