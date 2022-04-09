import { Simulator } from "@app/Simulator"
import { Scenario } from "@app/singleton/Scenario"
import { FileUtils } from "@app/utils/FileUtils"
import { existsSync, readFileSync } from "fs"

let scenarioPasswordFile: string

afterAll(async () => {
  FileUtils.RemoveFilesDirs(scenarioPasswordFile)
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
  scenarioPasswordFile = Scenario.Instance.element.scenarioPasswordFile
})

test('Run a scenario is encrypted', async () => {
  await Simulator.Run(readFileSync(scenarioPasswordFile).toString(), { password: 'thanh123' })
})