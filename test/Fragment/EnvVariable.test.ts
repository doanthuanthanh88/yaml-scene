import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"
import { join } from "path"

test('Var in fragment', async () => {
  await Simulator.Run(`
- Vars:
    textGlobal: global text
- Fragment: 
    file: ${join(__dirname, 'echo.yas.yaml')}
`)
  expect(VariableManager.Instance.vars.text).toBe('local')
})

test('Var is NOT overrided by env in fragment', async () => {
  process.env.TEXT = 'global'
  await Simulator.Run(`
- Vars:
    textGlobal: global text
- Fragment: 
    file: ${join(__dirname, 'echo.yas.yaml')}
  `)
  expect(VariableManager.Instance.vars.text).toBe('local')
})

test.only('Var is overrided by args in fragment', async () => {
  process.env.TEXT = 'global'
  await Simulator.Run(`
- Vars:
    textGlobal: global text
- Fragment: 
    file: ${join(__dirname, 'echo.yas.yaml')}
    vars:
      text: parent
      newVar: notExistedInFragment
  `)
  expect(VariableManager.Instance.vars.text).toBe('parent')
  expect(VariableManager.Instance.vars.newVar).toBe(undefined)
})
