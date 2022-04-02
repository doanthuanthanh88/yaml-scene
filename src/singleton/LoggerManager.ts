import LoggerLevel from 'loglevel'

export type Logger = LoggerLevel.Logger & { is: (logLevel: string) => Boolean }

export type LogLevel = 'slient' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | ''

export class LoggerManager {
  static get LogLevel() {
    return LoggerLevel.levels
  }

  private static _Instance = new LoggerManager()

  static GetLogger(level?: LogLevel) {
    return this._Instance.getLogger(level)
  }

  static SetDefaultLoggerLevel(level: string) {
    if (level === 'slient') {
      this.GetLogger().disableAll(true)
    } else if (level) {
      this.GetLogger().setDefaultLevel(level as any)
    }
  }

  #loggers = new Set()

  constructor() {
    this.getLogger().setDefaultLevel('info')
  }

  getLogger(level: LogLevel = '') {
    const logger = (!level ? LoggerLevel : LoggerLevel.getLogger(level)) as Logger
    if (!this.#loggers.has(level)) {
      if (level === 'slient') {
        logger.disableAll(true)
      } else if (level) {
        logger.setDefaultLevel(level as any)
      }
      logger.is = function (level: string) {
        return this.getLevel() >= LoggerLevel.levels[level.toUpperCase()]
      }
      this.#loggers.add(level)
    }
    return logger
  }

}
