export class TimeUtils {
  static GetMsTime(time: string | number): number {
    if (typeof time === 'string') {
      return parseInt(eval(time.replace('ms', '').replace('h', '*60m').replace('m', '*60s').replace('s', '*1000')))
    }
    return time
  }
  static Delay(time: number | string) {
    return new Promise((resolve) => {
      setTimeout(resolve, TimeUtils.GetMsTime(time))
    })
  }
}