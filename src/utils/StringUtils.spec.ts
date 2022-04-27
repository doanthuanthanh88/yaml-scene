import { StringUtils } from "./StringUtils"

describe('Split2', () => {
  it('Include only one character in the string', () => {
    expect(StringUtils.Split2('a=b', '=')).toEqual(['a', 'b'])
  })

  it('Include many characters in the string', () => {
    expect(StringUtils.Split2('a=b=c', '=')).toEqual(['a', 'b=c'])
  })

  it('No include many characters in the string', () => {
    expect(StringUtils.Split2('abc', '=')).toEqual(['abc', ''])
  })
})