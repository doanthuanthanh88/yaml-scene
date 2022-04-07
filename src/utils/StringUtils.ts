export class StringUtils {
  static Split2(urlStr: string, char = '?') {
    const idx = urlStr.indexOf(char)
    if (idx === -1) return [urlStr, '']
    const first = urlStr.substring(0, idx)
    const second = urlStr.substring(idx + 1)
    return [first, second]
  }
}