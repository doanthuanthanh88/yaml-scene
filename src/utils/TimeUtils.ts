export class TimeUtils {
  static GetMsTime(time: string | number): number {
    if (typeof time === 'string') {
      return parseInt(eval(time.replace('ms', '').replace('h', '*60m').replace('m', '*60s').replace('s', '*1000')))
    }
    return time
  }
  static Delay(time: number | string) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), TimeUtils.GetMsTime(time))
    })
  }
  static Pretty(time: number) {
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
  static async Until(condition: boolean, timeInterval: any) {
    return new Promise(async (resolve) => {
      while (!condition) {
        await TimeUtils.Delay(timeInterval)
      }
      resolve(condition)
    })
  }
}