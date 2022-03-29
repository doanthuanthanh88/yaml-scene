import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"

test('Delay', async () => {
  await Simulator.Run(`
- Vars:
    begin: \${Date.now()}
- Delay:
    title: Delay 1s
    time: 1s
- Vars:
    end1: \${Date.now()}
- Delay: 2s
- Vars:
    end2: \${Date.now()}
`)
  expect(Math.floor((VariableManager.Instance.vars.end1 - VariableManager.Instance.vars.begin) / 100) * 100).toEqual(1000)
  expect(Math.floor((VariableManager.Instance.vars.end2 - VariableManager.Instance.vars.end1) / 100) * 100).toEqual(2000)
})