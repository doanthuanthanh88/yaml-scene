import { Simulator } from "@app/Simulator"
import { LoggerManager } from "@app/singleton/LoggerManager"
import { VariableManager } from "@app/singleton/VariableManager"
import { join } from "path"

describe('Logger in scenario file', () => {
  test('Use default logger', async () => {
    await Simulator.Run(`
  steps:
    - Vars:
        logLevel: \${$.proxy.logger.getLevel()}
  `, { logLevel: null })
    expect(VariableManager.Instance.vars.logLevel).toBe(LoggerManager.LogLevel.INFO)
  })

  test('Set logLevel in scenario file', async () => {
    await Simulator.Run(`
  logLevel: error
  steps:
    - Vars:
        logLevel: \${$.proxy.logger.getLevel()}
  `, { logLevel: null })
    expect(VariableManager.Instance.vars.logLevel).toBe(LoggerManager.LogLevel.ERROR)
  })

  test('Set logger in scenario file and debug mode', async () => {
    await Simulator.Run(`
  logLevel: error
  steps:
    - Vars:
        logLevel: \${$.proxy.logger.getLevel()}
  `, { logLevel: 'info' })
    expect(VariableManager.Instance.vars.logLevel).toBe(LoggerManager.LogLevel.ERROR)
  })

  test('Set logger in scenario file and process.env', async () => {
    process.env.LOGLEVEL = 'slient'
    await Simulator.Run(`
  logLevel: \${process.env.LOGLEVEL}
  steps:
    - Vars:
        logLevel: \${$.proxy.logger.getLevel()}
  `, { logLevel: null })
    expect(VariableManager.Instance.vars.logLevel).toBe(LoggerManager.LogLevel.SILENT)
  })
})

test('Test logger in steps', async () => {
  process.env.LOGLEVEL = 'slient'
  await Simulator.Run(`
logLevel: info
steps:
  - Vars:
      parentLogLevel: \${$.proxy.logger.getLevel()}
  - Group:
      logLevel: slient
      steps:
        - Vars:
            stepLogLevel: \${$.proxy.logger.getLevel()}
`, { logLevel: null })
  expect(VariableManager.Instance.vars.parentLogLevel).toBe(LoggerManager.LogLevel.INFO)
  expect(VariableManager.Instance.vars.stepLogLevel).toBe(LoggerManager.LogLevel.SILENT)
})

describe('Logger in fragment file', () => {
  test('`logLevel` is set in both fragment and fragment file', async () => {
    await Simulator.Run(`
  logLevel: slient
  steps:
    - Vars:
        parentLogLevel: \${$.proxy.logger.getLevel()}
        
    - Fragment: 
        file: ${join(__dirname, 'echo1.yas.yaml')}
        logLevel: error
  
  `, { logLevel: null })
    expect(VariableManager.Instance.vars.parentLogLevel).toBe(LoggerManager.LogLevel.SILENT)
    expect(VariableManager.Instance.vars.fragmentLogLevel1).toBe(LoggerManager.LogLevel.WARN)
  })

  test('`logLevel` is NOT set in both fragment and fragment file', async () => {
    await Simulator.Run(`
  logLevel: slient
  steps:
    - Vars:
        parentLogLevel: \${$.proxy.logger.getLevel()}
        
    - Fragment: 
        file: ${join(__dirname, 'echo2.yas.yaml')}
  `, { logLevel: null })
    expect(VariableManager.Instance.vars.parentLogLevel).toBe(LoggerManager.LogLevel.SILENT)
    expect(VariableManager.Instance.vars.fragmentLogLevel2).toBe(LoggerManager.LogLevel.SILENT)
  })

  test('`logLevel` is set in fragment and NOT set in fragment file', async () => {
    await Simulator.Run(`
  logLevel: slient
  steps:
    - Vars:
        parentLogLevel: \${$.proxy.logger.getLevel()}
        
    - Fragment: 
        file: ${join(__dirname, 'echo2.yas.yaml')}
        logLevel: error
  `, { logLevel: null })
    expect(VariableManager.Instance.vars.parentLogLevel).toBe(LoggerManager.LogLevel.SILENT)
    expect(VariableManager.Instance.vars.fragmentLogLevel2).toBe(LoggerManager.LogLevel.ERROR)
  })
})
