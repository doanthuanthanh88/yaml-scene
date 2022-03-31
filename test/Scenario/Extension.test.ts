import { Simulator } from "@app/Simulator"
import { Scenario } from "@app/singleton/Scenario"
import { join } from "path"

afterAll(async () => {
  await Scenario.Instance.clean()
})

test('Extension', async () => {
  await Simulator.Run(`
logLevel: debug
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