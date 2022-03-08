import logger from 'loglevel'
import { Logger as Logger1 } from 'loglevel'

// logger.setDefaultLevel('debug')

export class LoggerFactory {
  private static _INSTANCE = {} as { [level: string]: Logger1 }

  static GetLogger(level?: string) {
    if (!level) return logger
    if (LoggerFactory._INSTANCE[level])
      return LoggerFactory._INSTANCE[level]
    LoggerFactory._INSTANCE[level] = logger.getLogger(level)
    if (level === 'slient') {
      LoggerFactory._INSTANCE[level].disableAll(true)
    } else {
      LoggerFactory._INSTANCE[level].setDefaultLevel(level as any)
    }
    return LoggerFactory._INSTANCE[level]
  }
}

export type Logger = Logger1