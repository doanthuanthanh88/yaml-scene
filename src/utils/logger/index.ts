import { Logger as Logger1, getLogger } from 'loglevel'

export class LoggerFactory {
  private loggers = {} as { [level: string]: Logger1 }
  private static readonly GLOBAL_LOGGER_NAME = Symbol(0)

  getLogger(level = '') {
    if (this.loggers[level])
      return this.loggers[level]

    this.loggers[level] = getLogger(level || LoggerFactory.GLOBAL_LOGGER_NAME)

    if (level === 'slient') {
      this.loggers[level].disableAll(true)
    } else if (level) {
      this.loggers[level].setDefaultLevel(level as any)
    }
    return this.loggers[level]
  }

  setLogger(name?: string, logLevel?: any) {
    if (logLevel === 'slient') {
      this.getLogger(name).disableAll()
    } else {
      this.getLogger(name).setDefaultLevel(logLevel)
    }
  }
}

export type Logger = Logger1