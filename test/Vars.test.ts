import { Simulator } from "@app/Simulator"

describe('Test assign value to global vars', () => {
  test('Simple value', async () => {
    const scenario = await Simulator.Run(`
- Vars:
    name: thanh
`)
    expect(scenario.variableManager.vars.name).toBe('thanh')
  })

  test('Complex value', async () => {
    const scenario = await Simulator.Run(`
- Vars:
    name: thanh
    hello: Say hello to \${name}
`)
    expect(scenario.variableManager.vars.hello).toBe('Say hello to thanh')
  })
})