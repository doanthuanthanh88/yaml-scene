/**
 * Utility functionals to handle Text
 * @class
 */
export class StringUtils {
  /**
   * Split text
   * @param {string} urlStr A text
   * @param {string} char Character to split. It's only split to 2 sections
   * @returns {string[]} Return an array includes 2 items
   * @example Split2('a=b=c') => ['a', 'b=c']
   */
  static Split2(urlStr: string, char = '?') {
    const idx = urlStr.indexOf(char)
    if (idx === -1) return [urlStr, '']
    const first = urlStr.substring(0, idx)
    const second = urlStr.substring(idx + 1)
    return [first, second]
  }
}