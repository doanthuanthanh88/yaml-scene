export class VarManager {
  static readonly Instance = new VarManager()

  private readonly _navPattern = /^(\$\{){1}(.+)\}$/
  globalVars = {} as { [key: string]: any }

  set(varObj: any, obj: any, defaultKey?: string) {
    if (!obj) return
    if (typeof varObj === 'string') {
      const vl = this.get(defaultKey ? obj[defaultKey] : obj)
      this.globalVars[varObj] = vl
    } else if (varObj && typeof varObj === 'object') {
      Object.keys(varObj).forEach(key => {
        const vl = this.get(varObj[key], { $: obj })
        this.globalVars[key] = vl
      })
    }
  }

  eval(obj: any, baseCtx?: any) {
    if (!obj) return obj
    let ctx: any
    if (baseCtx) {
      ctx = { ...this.globalVars, ...baseCtx }
    } else {
      ctx = this.globalVars
    }
    if (Array.isArray(obj)) {
      obj = obj.map(o => this.get(o, ctx))
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        obj[key] = this.get(obj[key], ctx)
      }
    } else if (typeof obj === 'string') {
      let vl;
      let evalStr = `let {${Object.keys(ctx).join(',')}} = ctx;\n`
      evalStr += `vl = ${obj}`
      eval(evalStr)
      return vl
    }
    return obj
  }

  get(obj: any, baseCtx?: any) {
    if (!obj) return obj
    let ctx: any
    if (baseCtx) {
      ctx = { ...this.globalVars, ...baseCtx }
    } else {
      ctx = this.globalVars
    }
    if (Array.isArray(obj)) {
      obj = obj.map(o => this.get(o, ctx))
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        obj[key] = this.get(obj[key], ctx)
      }
    } else if (typeof obj === 'string' && obj.includes('${')) {
      let vl;
      let evalStr = `let {${Object.keys(ctx).join(',')}} = ctx;\n`
      let m
      if (m = obj.match(this._navPattern)) {
        evalStr += `vl = ${m[2]}`
      } else {
        evalStr += `vl = \`${obj}\``
      }
      eval(evalStr)
      return vl
    }
    return obj
  }
}