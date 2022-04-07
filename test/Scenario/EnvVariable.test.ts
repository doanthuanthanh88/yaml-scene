import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"

test('Env vars in scenario', async () => {
  await Simulator.Run(`
vars:
  text: local
steps:
  - Echo: \${text}
  `)
  expect(VariableManager.Instance.vars.text).toBe('local')
})

test('Var is overrided by env in scenario', async () => {
  process.env.TEXT = 'global'
  await Simulator.Run(`
vars:
  text: local
steps:
  - Echo: \${text}
  `)
  expect(VariableManager.Instance.vars.text).toBe('global')
})

