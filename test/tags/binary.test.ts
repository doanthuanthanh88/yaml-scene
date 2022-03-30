import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"
import { ReadStream } from "fs"
import { join } from "path"

test('!binary tag', async () => {
  await Simulator.Run(`
  - Vars:
      uploadFile: ${join(__dirname, '../assets/custom1.js')}
  - Vars:
      myBin: !tag
        tags/binary: \${uploadFile}
`)
  expect(VariableManager.Instance.vars.myBin).toBeInstanceOf(ReadStream)
})