import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"

test('Test events', async () => {
  await Simulator.Run(`
- Script/Js: !function |
    $.proxy.events.on('test', ok => $.proxy.vars['ok'] = ok)
    $.proxy.events.emit('test', 'ok')
- Pause: 100ms
`)
  expect(VariableManager.Instance.vars.ok).toBe('ok')
})