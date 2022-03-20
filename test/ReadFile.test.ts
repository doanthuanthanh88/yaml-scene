import { Simulator } from "@app/Simulator"
import { unlinkSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

describe.each([
  { adapter: 'Text', filename: 'data.txt', data: 'Hello world' },
  { adapter: 'Json', filename: 'data.json', data: { "say": "hello world" } },
  { adapter: 'Csv', filename: 'data.csv', data: [['label 1', 'label 2', 'label 3', 'label 4'], ['1', '2', '3', '4']] },
  { adapter: 'Yaml', filename: 'data.yaml', data: { "say": "hello world" } },
  { adapter: 'Xml', filename: 'data.xml', data: { "say": "hello world" } },
])('Test to "ReadFile" and "WriteFile"', ({ adapter, filename, data }) => {
  const path = join(tmpdir(), Math.random() + filename)

  beforeAll(async () => {
    await Simulator.Run(`
- Vars:
    data: ${JSON.stringify(data)}
- WriteFile:
    path: ${path}
    adapters: 
      - ${adapter}
    content: \${data}
    
- WriteFile:
    path: ${path}.encrypted
    adapters: 
      - ${adapter}
      - Password: thanh123
    content: \${data}      
`)
  })

  afterAll(() => {
    unlinkSync(`${path}`)
    unlinkSync(`${path}.encrypted`)
  })

  test(`Read a ${adapter} file`, async () => {
    const scenario = await Simulator.Run(`
- ReadFile:
    path: ${path}
    adapters: 
      - ${adapter}
    var: content
`)
    expect(scenario.variableManager.vars.content).toStrictEqual(data)
  })

  test(`Read a ${adapter} file with password`, async () => {
    const scenario = await Simulator.Run(`
- ReadFile:
    path: ${path}.encrypted
    adapters:
      - Password: thanh123
      - ${adapter}
    var: content
`)
    expect(scenario.variableManager.vars.content).toStrictEqual(data)
  })

})