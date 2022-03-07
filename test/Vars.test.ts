import { VarManager } from "@app/singleton/VarManager"
import { Simulator } from "@app/Simulator"

describe('Test assign value to global vars', () => {
  test('Simple value', async () => {
    await Simulator.Run(`
- Vars:
    name: thanh
`)
    expect(VarManager.Instance.vars.name).toBe('thanh')
  })

  test('Complex value', async () => {
    await Simulator.Run(`
- Vars:
    name: thanh
    hello: Say hello to \${name}
`)
    expect(VarManager.Instance.vars.hello).toBe('Say hello to thanh')
  })
})