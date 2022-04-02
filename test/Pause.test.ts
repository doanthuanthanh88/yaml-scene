import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"

test('Pause', async () => {
    await Simulator.Run(`
- Vars:
    begin: \${Date.now()}

- Pause:
    title: It keeps playing when user enter OR after 1 second, user not enter then it keeps playing
    timeout: 1s

- Vars:
    end1: \${Date.now()}

- Pause: 1s       # Delay 1 seconds then it keeps playing

- Vars:
    end2: \${Date.now()}

- Pause:
    title: Delay 1 seconds then it keeps playing
    time: 1s

- Vars:
    end3: \${Date.now()}

`)
    expect(Math.floor((VariableManager.Instance.vars.end1 - VariableManager.Instance.vars.begin) / 1000) * 1000).toEqual(1000)
    expect(Math.floor((VariableManager.Instance.vars.end2 - VariableManager.Instance.vars.end1) / 1000) * 1000).toEqual(1000)
    expect(Math.floor((VariableManager.Instance.vars.end3 - VariableManager.Instance.vars.end2) / 1000) * 1000).toEqual(1000)
})