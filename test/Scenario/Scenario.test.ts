import { Simulator } from "@app/Simulator"
import { Scenario } from "@app/singleton/Scenario"
import { existsSync, mkdirSync, readFileSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"

afterAll(async () => {
  await Scenario.Instance.clean()
})

test('Generate a scenario is encrypted', async () => {
  const localPath = join(tmpdir(), Math.random().toString())
  mkdirSync(localPath, { recursive: true })
  await Simulator.Run(`
title: Test encrypt file
password: thanh123
logLevel: error
steps:
- Echo: 
    message: Hello world
    logLevel: info
`)
  expect(existsSync(Scenario.Instance.scenarioPasswordFile)).toEqual(true)
})

test('Run a scenario is encrypted', async () => {
  await Simulator.Run(readFileSync(Scenario.Instance.scenarioPasswordFile).toString(), { password: 'thanh123' })
})