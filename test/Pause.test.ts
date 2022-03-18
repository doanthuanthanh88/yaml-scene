import { Simulator } from "@app/Simulator"

test('Pause', async () => {
    const scenario = await Simulator.Run(`
- Vars:
    begin: \${Date.now()}

- Pause:
    title: It keeps playing when user enter OR after 1 second, user not enter then it keeps playing
    timeout: 1s

- Vars:
    end1: \${Date.now()}

- Pause: 1s       # Sleep 1 seconds then it keeps playing

- Vars:
    end2: \${Date.now()}

- Pause:
    title: Sleep 1 seconds then it keeps playing
    time: 1s

- Vars:
    end3: \${Date.now()}

`)
    expect(Math.floor((scenario.variableManager.vars.end1 - scenario.variableManager.vars.begin) / 100) * 100).toEqual(1000)
    expect(Math.floor((scenario.variableManager.vars.end2 - scenario.variableManager.vars.end1) / 100) * 100).toEqual(1000)
    expect(Math.floor((scenario.variableManager.vars.end3 - scenario.variableManager.vars.end2) / 100) * 100).toEqual(1000)
}, 60000)