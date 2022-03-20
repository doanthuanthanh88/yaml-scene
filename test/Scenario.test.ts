import { Simulator } from "@app/Simulator"
import { existsSync, readFileSync, unlinkSync } from "fs"

describe('Scenario run', () => {
  let scenarioFile: string

  afterAll(() => {
    if (scenarioFile) {
      unlinkSync(scenarioFile)
    }
  })

  test('Encrypt scenario', async () => {
    const scenario = await Simulator.Run(`
title: Test encrypt file
password: thanh123
steps:
- Echo: Hello world
    `)
    scenarioFile = scenario.scenarioFile.replace('.yaml', '')
    expect(existsSync(scenarioFile)).toEqual(true)

    await Simulator.Run(readFileSync(scenarioFile).toString(), { password: 'thanh123' })
  })
})