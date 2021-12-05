import { ElementFactory } from "@app/elements/ElementFactory"
import { VarManager } from "@app/singleton/VarManager"
import { existsSync, unlinkSync } from "fs"
import { join } from "path"

describe.each([
  { type: 'text', filename: 'data.txt', data: 'Hello world' },
  { type: 'json', filename: 'data.json', data: { "say": "hello world" } },
  { type: 'csv', filename: 'data.csv', data: [['label 1', 'label 2', 'label 3', 'label 4'], ['1', '2', '3', '4']] },
  { type: 'yaml', filename: 'data.yaml', data: { "say": "hello world" } },
  { type: 'xml', filename: 'data.xml', data: { "say": "hello world" } },
])('Test to "ReadFile" and "WriteFile"', ({ type, filename, data }) => {
  const path = join(__dirname, filename)

  afterAll(() => {
    unlinkSync(path)
  })

  test(`Write a ${type} file`, async () => {
    const elem = ElementFactory.CreateElement('WriteFile')
    elem.init({
      path,
      type,
      content: data
    })
    try {
      await elem.prepare()
      await elem.exec()
      expect(existsSync(path)).toBe(true)
    } finally {
      await elem.dispose()
    }
  })

  test(`Read a ${type} file`, async () => {
    const elem = ElementFactory.CreateElement('ReadFile')
    elem.init({
      path,
      type,
      var: 'content'
    })
    try {
      await elem.prepare()
      await elem.exec()
      expect(VarManager.Instance.globalVars.content).toStrictEqual(data)
    } finally {
      await elem.dispose()
    }
  })

  test(`Write a ${type} file with password`, async () => {
    const elem = ElementFactory.CreateElement('WriteFile')
    elem.init({
      path,
      type,
      encrypt: {
        password: 'thanh123'
      },
      content: data
    })
    try {
      await elem.prepare()
      await elem.exec()
      expect(existsSync(path)).toBe(true)
    } finally {
      await elem.dispose()
    }
  })

  test(`Read a ${type} file`, async () => {
    const elem = ElementFactory.CreateElement('ReadFile')
    elem.init({
      path,
      type,
      decrypt: {
        password: 'thanh123'
      },
      var: 'content'
    })
    try {
      await elem.prepare()
      await elem.exec()
      expect(VarManager.Instance.globalVars.content).toStrictEqual(data)
    } finally {
      await elem.dispose()
    }
  })

})
