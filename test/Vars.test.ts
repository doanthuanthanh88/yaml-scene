import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"
import { Base64 } from "@app/utils/encrypt/Base64"
import { MD5 } from "@app/utils/encrypt/MD5"

describe('Test assign value to global vars', () => {
  test('Use vars when variables not declared', async () => {
    let err
    try {
      await Simulator.Run(`
- Echo: \${text}
    `)
    } catch (error) {
      err = error
    }
    expect(err?.message).toBe('text is not defined')
  })

  test('Simple value', async () => {
    await Simulator.Run(`
- Vars:
    name: thanh
`)
    expect(VariableManager.Instance.vars.name).toBe('thanh')
  })

  test('Complex value', async () => {
    await Simulator.Run(`
- Vars:
    name1: thanh
    hello: Say hello to \${name1}
`)
    expect(VariableManager.Instance.vars.name).toBe(undefined)
    expect(VariableManager.Instance.vars.hello).toBe('Say hello to thanh')
  })

  test('Change var in scenario', async () => {
    await Simulator.Run(`
vars:
  text: local
steps:
  - Vars:
      text: \${text}-updated
  - Echo: \${text}
  `)
    expect(VariableManager.Instance.vars.text).toBe('local-updated')
  })

  test('Utility variables', async () => {
    await Simulator.Run(`
- Vars:
    base64Encrypt: \${$$base64.encrypt("thanh")}
    md5: \${$$md5.encrypt("thanh")}
    encryptText: \${$$aes.encrypt("thanh", "mypass")}
    text: \${$$text.red("thanh")}

- Vars:
    base64Decrypt: \${$$base64.decrypt(base64Encrypt)}
    decryptText: \${$$aes.decrypt(encryptText, "mypass")}
`)
    expect(VariableManager.Instance.vars.encryptText).toHaveLength(65)
    expect(VariableManager.Instance.vars.decryptText).toBe('thanh')
    expect(VariableManager.Instance.vars.base64Encrypt).toBe(Base64.Instance.encrypt('thanh'))
    expect(VariableManager.Instance.vars.base64Decrypt).toBe('thanh')
    expect(VariableManager.Instance.vars.md5).toBe(MD5.Instance.encrypt('thanh'))
  })
})