import { Simulator } from "@app/Simulator"
import { Scenario } from "@app/singleton/Scenario"
import { existsSync, readFileSync } from "fs"

afterAll(async () => {
  await Scenario.Instance.element.clean()
  expect(existsSync(Scenario.Instance.element.scenarioPasswordFile)).toBe(false)
})

test('Generate a scenario is encrypted', async () => {
  await Simulator.Run(`
title: Test encrypt file
password: thanh123
steps:
- Echo: 
    message: Hello world
`)
  expect(existsSync(Scenario.Instance.element.scenarioPasswordFile)).toEqual(true)
})

test('Run a scenario is encrypted', async () => {
  await Simulator.Run(readFileSync(Scenario.Instance.element.scenarioPasswordFile).toString(), { password: 'thanh123' })
})