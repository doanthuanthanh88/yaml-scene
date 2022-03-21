import { Simulator } from "@app/Simulator"
import { Scenario } from "@app/singleton/Scenario"
import { existsSync, readFileSync } from "fs"

describe('Scenario run', () => {
  let scenario: Scenario

  afterAll(async () => {
    await scenario?.clean()
  })

  test('Encrypt scenario', async () => {
    scenario = await Simulator.Run(`
title: Test encrypt file
password: thanh123
logLevel: info
install:
  global: false
  localPath: ./
  extensions: 
    - yas-grpc
steps:
- Echo: Hello world
    `)
    expect(existsSync(scenario.scenarioPasswordFile)).toEqual(true)

    await Simulator.Run(readFileSync(scenario.scenarioPasswordFile).toString(), { password: 'thanh123' })

  }, 60000 * 5)
})