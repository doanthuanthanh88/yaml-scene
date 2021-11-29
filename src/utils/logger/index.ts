import { getLogger, setDefaultLevel, Logger as Logger1 } from 'loglevel'

setDefaultLevel('debug')

export class LoggerFactory {
  private static _INSTANCE = {} as { [level: string]: Logger1 }

  static GetLogger(level = 'debug') {
    if (LoggerFactory._INSTANCE[level])
      return LoggerFactory._INSTANCE[level]
    LoggerFactory._INSTANCE[level] = getLogger(level)
    LoggerFactory._INSTANCE[level].setDefaultLevel(level as any)
    return LoggerFactory._INSTANCE[level]
  }
}

export type Logger = Logger1