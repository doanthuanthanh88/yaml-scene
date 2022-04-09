import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"
import { join } from "path"

describe('!json tag', () => {
  test('Upload local file', async () => {
    await Simulator.Run(`
- Vars:
    uploadFile: ${join(__dirname, '../assets/tsconfig.json')}
- Vars:
    myBin: !tag
      file/json: \${uploadFile}
`)
    expect(typeof VariableManager.Instance.vars.myBin).toBe('object')
  })

  test('Upload file from URL', async () => {
    await Simulator.Run(`
- Vars:
    uploadFile: https://raw.githubusercontent.com/doanthuanthanh88/yaml-scene/main/tsconfig.json
- Vars:
    myBin: !tag
      file/json: \${uploadFile}
`)
    expect(typeof VariableManager.Instance.vars.myBin).toBe('object')
  })
})