import { Simulator } from "@app/Simulator"
import { ExtensionManager } from "@app/singleton/ExtensionManager"
import { Scenario } from "@app/singleton/Scenario"
import { FileUtils } from "@app/utils/FileUtils"
import { existsSync } from "fs"
import { join } from "path"

const localPath = FileUtils.GetNewTempPath()

afterAll(async () => {
  await Scenario.Instance.element.clean()
})

test('Test install and use packages in local modules', async () => {
  await Simulator.Run(`
install:
  local:
    path: ${localPath}
    dependencies: 
      - loglevel
steps:
  - Echo: Done
`)
  expect(existsSync(join(localPath, 'node_modules', 'loglevel'))).toEqual(true)
}, 120000)

test('Test install and use packages in global modules', async () => {
  await Simulator.Run(`
install:
  global:
    dependencies: 
      - loglevel
steps:
  - Echo: Done
`)
  expect(ExtensionManager.Instance.globalModuleManager?.get('loglevel')?.length).toBeGreaterThan(0)
}, 120000)