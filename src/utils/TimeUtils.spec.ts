import { TimeUtils } from "./TimeUtils"

describe('GetMsTime', () => {
  it('Time is a string', () => {
    expect(TimeUtils.GetMsTime('1s')).toEqual(1000)
    expect(TimeUtils.GetMsTime('1m')).toEqual(60 * 1000)
    expect(TimeUtils.GetMsTime('1h')).toEqual(60 * 60 * 1000)
    expect(TimeUtils.GetMsTime('1ms')).toEqual(1)
  })

  it('Time is number', () => {
    expect(TimeUtils.GetMsTime(1001)).toEqual(1001)
  })

  it('Time is null or undefined', () => {
    expect(TimeUtils.GetMsTime(null)).toEqual(null)
    expect(TimeUtils.GetMsTime(undefined)).toEqual(undefined)
  })

  it('Time is not valid', () => {
    expect(() => TimeUtils.GetMsTime('test')).toThrow(`Time "test" is not valid`)
  })
})

describe('Delay', () => {
  it.each([
    500,
    '500ms',
    '0.5s'
  ])('%p', async (time: any) => {
    const begin = Date.now()
    await TimeUtils.Delay(time)
    const end = Date.now() - begin
    const ms = TimeUtils.GetMsTime(time)
    expect(end).toBeGreaterThanOrEqual(ms)
    expect(end).toBeLessThanOrEqual(ms + 50)
  })
})

describe('Pretty', () => {
  it.each([
    [1000 + 1, '1s 1ms'],
    [(60 * 1000) + 1000 + 1, '1m1s 1ms'],
    [(60 * 60 * 1000) + (60 * 1000) + 1000 + 1, '1h1m1s 1ms'],
  ])('%p', (inp, out) => {
    expect(TimeUtils.Pretty(inp)).toEqual(out)
  })

  it('Time is a negative number', () => {
    expect(() => TimeUtils.Pretty(-1)).toThrow(new TypeError('Time is not valid'))
  })
})
