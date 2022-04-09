import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"
import { join } from "path"

describe('!buffer tag', () => {
  test('Upload local file', async () => {
    await Simulator.Run(`
- Vars:
    uploadFile: ${join(__dirname, '../assets/tsconfig.json')}
- Vars:
    myBin: !tag
      file/buffer: \${uploadFile}
`)
    expect(VariableManager.Instance.vars.myBin).toBeInstanceOf(Buffer)
  })

  test('Upload file from URL', async () => {
    await Simulator.Run(`
- Vars:
    uploadFile: https://raw.githubusercontent.com/doanthuanthanh88/yaml-scene/main/tsconfig.json
- Vars:
    myBin: !tag
      file/buffer: \${uploadFile}
`)
    expect(VariableManager.Instance.vars.myBin).toBeInstanceOf(Buffer)
  })
})