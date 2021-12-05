import { ElementFactory } from "@app/elements/ElementFactory"
import { VarManager } from "@app/singleton/VarManager"

describe('Test assign value to global vars', () => {
  test('Simple value', async () => {
    const elem = ElementFactory.CreateElement('Vars')
    elem.init({
      name: 'thanh'
    })
    try {
      await elem.prepare()
      await elem.exec()
      expect(VarManager.Instance.globalVars.name).toBe('thanh')
    } finally {
      await elem.dispose()
    }
  })

  test('Complex value', async () => {
    const elem = ElementFactory.CreateElement('Vars')
    elem.init({
      name: 'thanh',
      hello: 'Say hello to ${name}'
    })
    try {
      await elem.prepare()
      await elem.exec()
      expect(VarManager.Instance.globalVars.hello).toBe('Say hello to thanh')
    } finally {
      await elem.dispose()
    }
  })
})
