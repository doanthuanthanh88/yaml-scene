import { Simulator } from "@app/Simulator"
import { ExtensionManager } from "@app/singleton/ExtensionManager"
import { Scenario } from "@app/singleton/Scenario"
import { existsSync } from "fs"
import { join } from "path"

afterAll(async () => {
  await Scenario.Instance.element.clean()
})

test('Extension', async () => {
  await Simulator.Run(`
logLevel: slient
extensions:
  element1: ${join(__dirname, '../assets/custom1.js')}
  customFolder: ${join(__dirname, '../assets')}
steps:
- element1:
    title: echo 01
- customFolder/custom2: 
    title: echo 02
  `)
})

test.skip('Auto install miss extensions', async () => {
  await Simulator.Run(`
logLevel: slient
steps:
- yas-http/Summary:
    title: Testing result
  `)

  expect(existsSync(ExtensionManager.Instance.globalModuleManager?.get('yas-http'))).toBe(true)
})
