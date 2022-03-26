import { Simulator } from "@app/Simulator"

test('Delay', async () => {
  const scenario = await Simulator.Run(`
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
  expect(Math.floor((scenario.variableManager.vars.end1 - scenario.variableManager.vars.begin) / 100) * 100).toEqual(1000)
  expect(Math.floor((scenario.variableManager.vars.end2 - scenario.variableManager.vars.end1) / 100) * 100).toEqual(2000)
})