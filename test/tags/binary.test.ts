import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"
import { tmpdir } from "os"
import { join } from "path"
import { Readable } from "stream"

describe('!binary tag', () => {
  const uploadDir = join(tmpdir(), 'uploadFile')

  test('Upload local file', async () => {
    await Simulator.Run(`
- Vars:
    uploadDir: ${uploadDir}
    uploadFile: ${join(__dirname, '../assets/custom1.js')}
- Vars:
    myBin: !tag
      tags/binary: \${uploadFile}
`)
    expect(VariableManager.Instance.vars.myBin).toBeInstanceOf(Readable)
  })

  test('Upload file from URL', async () => {
    await Simulator.Run(`
- Vars:
    uploadDir: ${uploadDir}
    uploadFile: https://raw.githubusercontent.com/doanthuanthanh88/yaml-scene/main/tsconfig.json
- Vars:
    myBin: !tag
      tags/binary: \${uploadFile}
`)
    expect(VariableManager.Instance.vars.myBin).toBeInstanceOf(Readable)
  })
})