export class AutoCompleteSuggestion {
  static STARTSWITH_AND_ALLOW_NEW = (inp: string, choices = []) => {
    if (!inp) return choices
    const existed = choices.filter(e => e.title.toLowerCase().startsWith(inp.toLowerCase()))
    let isExisted = existed.length === 1 && existed[0].title.toLowerCase() === inp.toLowerCase()
    if (isExisted) return existed
    return [{ title: inp, value: inp, disabled: true }, ...existed]
  }
  static STARTSWITH = (inp: string, choices = []) => {
    if (!inp) return choices
    const existed = choices.filter(e => e.title.toLowerCase().startsWith(inp.toLowerCase()))
    return existed
  }
  static INCLUDE_AND_ALLOW_NEW = (inp: string, choices = []) => {
    if (!inp) return choices
    const existed = choices.filter(e => e.title.toLowerCase().includes(inp.toLowerCase()))
    let isExisted = existed.length === 1 && existed[0].title.toLowerCase() === inp.toLowerCase()
    if (isExisted) return existed
    return [{ title: inp, value: inp, disabled: true }, ...existed]
  }
  static INCLUDE = (inp: string, choices = []) => {
    if (!inp) return choices
    const existed = choices.filter(e => e.title.toLowerCase().includes(inp.toLowerCase()))
    return existed
  }
}