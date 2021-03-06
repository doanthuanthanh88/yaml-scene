import { TraceError } from "./error/TraceError"

/**
 * Input time value
 */
export type TimeUnit = string | number

/**
 * Utility functionals to handle DateTime
 * @class
 */
export class TimeUtils {
  /**
   * Convert time with friendly name to miliseconds
   * @param time Time
   * @returns Miliseconds
   * @example 
   * GetMsTime('2s') => 2000
   * GetMsTime(5000) => 5000
   */
  static GetMsTime(time?: TimeUnit): number {
    try {
      if (typeof time === 'string') {
        return parseInt(eval(time.replace('ms', '').replace('h', '*60m').replace('m', '*60s').replace('s', '*1000')))
      } else if (typeof time === 'number') {
        return time
      } else if (!time) {
        return time
      }
      throw new Error()
    } catch {
      throw new TraceError(`Time "${time}" is not valid`, { time })
    }
  }

  /**
   * Sleep for a time before keep playing
   * @param time Time to sleep
   */
  static Delay(time: TimeUnit): Promise<true> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), TimeUtils.GetMsTime(time))
    })
  }

  /**
   * Convert time to pretty format
   * @param time Miliseconds
   * @returns Friendly time
   * @example Pretty(65000) => 1m5s 0ms
   */
  static Pretty(time: number): string {
    if (typeof time !== 'number' || time < 0) throw new TypeError('Time is not valid')
    let h, m, s, ms
    const msg = []
    h = Math.floor(time / (60 * 60 * 1000))
    if (h > 0) msg.push(h + 'h')
    time = time - h * 60 * 60 * 1000
    m = Math.floor(time / (60 * 1000))
    if (m > 0 || msg.length) msg.push(m + 'm')
    time = time - m * 60 * 1000
    s = Math.floor(time / (1000))
    if (s > 0 || msg.length) msg.push(s + 's ')
    ms = time % 1000
    msg.push(ms + 'ms')
    return msg.join('')
  }

}