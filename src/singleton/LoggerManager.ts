import Logger from 'loglevel'

export class LoggerManager {
  static readonly LogLevel = {
    TRACE: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    SILENT: 5,
  }

  private static _Instance = new LoggerManager()

  static GetLogger(level?: string) {
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

  getLogger(level = '') {
    const logger = !level ? Logger : Logger.getLogger(level)
    if (!this.#loggers.has(level)) {
      if (level === 'slient') {
        logger.disableAll(true)
      } else if (level) {
        logger.setDefaultLevel(level as any)
      }
      this.#loggers.add(level)
    }
    return logger
  }

}
