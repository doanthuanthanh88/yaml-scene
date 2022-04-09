import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"
import { FileUtils } from "@app/utils/FileUtils"

describe('File/Reader and File/Writer', () => {
  const path = FileUtils.GetNewTempPath('.xlsx')

  afterAll(() => {
    FileUtils.RemoveFilesDirs(path)
  })

  test('Excel file', async () => {
    await Simulator.Run(`
- File/Writer:
    path: ${path}
    adapters: 
      - Excel
    content: [{
      foo: 'bar',
      qux: 'moo',
      poo: null,
      age: 1
    }, 
    {
      foo: 'bar1',
      qux: 'moo2',
      poo: 444,
      age: 2
    }]

- File/Reader:
    path: ${path}
    adapters: 
      - Excel:
          sheets:
            - name: Sheet 1
              range: 'A1:C9'
              header: 
                rows: 1
              columnToKey:
                A: foo name
                B: qux label
                C: poo title
    var: content
  `)
    expect(VariableManager.Instance.vars.content).toEqual({
      'Sheet 1': [
        { 'foo name': 'bar', 'qux label': 'moo' },
        { 'foo name': 'bar1', 'qux label': 'moo2', 'poo title': 444 }
      ]
    })
  })
})

describe.each([
  { adapter: 'Text', filename: '.txt', data: 'Hello world' },
  { adapter: 'Json', filename: '.json', data: { "say": "hello world" } },
  { adapter: 'Csv', filename: '.csv', data: [['label 1', 'label 2', 'label 3', 'label 4'], ['1', '2', '3', '4']] },
  { adapter: 'Yaml', filename: '.yaml', data: { "say": "hello world" } },
  { adapter: 'Xml', filename: '.xml', data: { "say": "hello world" } },
])('File/Reader and File/Writer', ({ adapter, filename, data }) => {
  const path = FileUtils.GetNewTempPath(filename)

  beforeAll(async () => {
    await Simulator.Run(`
- Vars:
    data: ${JSON.stringify(data)}
- File/Writer:
    path: ${path}
    adapters: 
      - ${adapter}
    content: \${data}
    
- File/Writer:
    path: ${path}.encrypted
    adapters: 
      - ${adapter}
      - Password: thanh123
    content: \${data}      
`)
  })

  afterAll(() => {
    FileUtils.RemoveFilesDirs(`${path}`, `${path}.encrypted`)
  })

  test(`Read a ${adapter} file`, async () => {
    await Simulator.Run(`
- File/Reader:
    path: ${path}
    adapters: 
      - ${adapter}
    var: content
`)
    expect(VariableManager.Instance.vars.content).toStrictEqual(data)
  })

  test(`Read a ${adapter} file with password`, async () => {
    await Simulator.Run(`
- File/Reader:
    path: ${path}.encrypted
    adapters:
      - Password: thanh123
      - ${adapter}
    var: content
`)
    expect(VariableManager.Instance.vars.content).toStrictEqual(data)
  })

})