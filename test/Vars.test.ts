import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"

describe('Test assign value to global vars', () => {
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
})