import { ElementProxy } from "@app/elements/ElementProxy"
import Pause from "@app/elements/Pause"
import { Simulator } from "@app/Simulator"
import { TimeUtils } from "@app/utils/TimeUtils"

test('Test async scenario', async () => {
  const t = Simulator.Run(`
- Pause:
    $id: pauseElement
    title: Delay forever
`)

  await TimeUtils.Delay(500)
  ElementProxy.GetElementProxy<Pause>('pauseElement').element.stop()

  await t

  expect(true)

})
