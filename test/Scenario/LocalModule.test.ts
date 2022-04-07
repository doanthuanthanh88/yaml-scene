import { Simulator } from "@app/Simulator"
import { Scenario } from "@app/singleton/Scenario"
import { existsSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

const localPath = join(tmpdir(), Math.random().toString())

afterAll(async () => {
  await Scenario.Instance.element.clean()
})

test('Test install and use packages in local modules', async () => {
  await Simulator.Run(`
install:
  localPath: ${localPath}
  dependencies: 
    - loglevel
steps:
  - Echo: Done
`)
  expect(existsSync(join(localPath, 'node_modules', 'loglevel'))).toEqual(true)
}, 120000)