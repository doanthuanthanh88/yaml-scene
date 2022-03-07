import { Simulator } from "@app/Simulator"
import { VarManager } from "@app/singleton/VarManager"
import { existsSync, unlinkSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

describe.each([
  { type: 'text', filename: 'data.txt', data: 'Hello world' },
  { type: 'json', filename: 'data.json', data: { "say": "hello world" } },
  { type: 'csv', filename: 'data.csv', data: [['label 1', 'label 2', 'label 3', 'label 4'], ['1', '2', '3', '4']] },
  { type: 'yaml', filename: 'data.yaml', data: { "say": "hello world" } },
  { type: 'xml', filename: 'data.xml', data: { "say": "hello world" } },
])('Test to "ReadFile" and "WriteFile"', ({ type, filename, data }) => {
  const path = join(tmpdir(), filename)

  afterAll(() => {
    unlinkSync(path)
  })

  test(`Write a ${type} file`, async () => {
    await Simulator.Run(`
- Vars:
    data: ${JSON.stringify(data)}
- WriteFile:
    path: ${path}
    type: ${type}
    content: \${data}
`)
    expect(existsSync(path)).toBe(true)
  })

  test(`Read a ${type} file`, async () => {
    await Simulator.Run(`
- ReadFile:
    path: ${path}
    type: ${type}
    var: content
`)
    expect(VarManager.Instance.vars.content).toStrictEqual(data)
  })

  test(`Write a ${type} file with password`, async () => {
    await Simulator.Run(`
- Vars:
    data: ${JSON.stringify(data)}
- WriteFile:
    path: ${path}
    type: ${type}
    content: \${data}
    encrypt:
      password: thanh123
`)
    expect(existsSync(path)).toBe(true)
  })

  test(`Read a ${type} file with password`, async () => {
    await Simulator.Run(`
- ReadFile:
    path: ${path}
    type: ${type}
    var: content
    decrypt:
      password: thanh123
`)
    expect(VarManager.Instance.vars.content).toStrictEqual(data)
  })

})