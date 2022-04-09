import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"
import { join } from "path"

describe('!text tag', () => {
  test('Upload local file', async () => {
    await Simulator.Run(`
- Vars:
    uploadFile: ${join(__dirname, '../assets/tsconfig.json')}
- Vars:
    myBin: !tag
      file/text: \${uploadFile}
`)
    expect(typeof VariableManager.Instance.vars.myBin).toBe('string')
  })

  test('Upload file from URL', async () => {
    await Simulator.Run(`
- Vars:
    uploadFile: https://raw.githubusercontent.com/doanthuanthanh88/yaml-scene/main/tsconfig.json
- Vars:
    myBin: !tag
      file/text: \${uploadFile}
`)
    expect(typeof VariableManager.Instance.vars.myBin).toBe('string')
  })
})