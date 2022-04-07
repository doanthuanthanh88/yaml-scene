import { Simulator } from "@app/Simulator"
import { Scenario } from "@app/singleton/Scenario"
import { existsSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

const localPath = join(tmpdir(), Math.random().toString())

afterAll(async () => {
  await Scenario.Instance.element.clean()
})

test.skip('Test install and use packages in local modules', async () => {
  await Simulator.Run(`
install:
  localPath: ${localPath}
  dependencies: 
    - yas-sequence-diagram
steps:
- yas-sequence-diagram:
    commentTag: ///
    includes: 
      - ${join(__dirname, '../../src')}
    excludes: 
      - node_modules
    includePattern: ".+\\\\.ts$"
    outDir: "${localPath}"
`)
  expect(existsSync(join(localPath, 'README.md'))).toEqual(true)
  expect(existsSync(join(localPath, 'node_modules', 'yas-sequence-diagram'))).toEqual(true)
}, 120000)