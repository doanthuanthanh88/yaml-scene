import { Simulator } from "@app/Simulator"

test('Simple value', async () => {
  await Simulator.Run(`
- Vars:
    name: thanh
`)
})