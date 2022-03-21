

export class VariableManager {
  private static readonly _NavPattern = /^(\$\{){1}([^\}]+)\}$/

  readonly vars = {} as { [key: string]: any }

  constructor(initVar: any) {
    if (initVar) {
      Object.assign(this.vars, initVar)
    }
  }

  set(varObj: any, obj: any, defaultKey?: string) {
    // if (!obj) return
    if (typeof varObj === 'string') {
      const vl = this.get(defaultKey ? eval(`obj.${defaultKey}`) : obj)
      this.vars[varObj] = vl
    } else if (varObj && typeof varObj === 'object') {
      Object.keys(varObj).forEach(key => {
        const vl = this.get(varObj[key], { _: obj })
        this.vars[key] = vl
      })
    }
  }

  eval(obj: any, baseCtx?: any) {
    if (!obj) return obj
    let ctx: any
    if (baseCtx) {
      ctx = { ...this.vars, ...baseCtx }
    } else {
      ctx = this.vars
    }
    if (Array.isArray(obj)) {
      obj = obj.map(o => this.get(o, ctx))
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        obj[key] = this.get(obj[key], ctx)
      }
    } else if (typeof obj === 'string') {
      let vl;
      const isAsync = obj?.includes('await ')
      const evalStr = `vl = (${isAsync ? 'async' : ''}({${Object.keys(ctx).join(',')}}) => { 
        ${obj}
      })(ctx)`
      eval(evalStr)
      return vl
    }
    return obj
  }

  get(obj: any, baseCtx?: any) {
    if (!obj) return obj
    let ctx: any
    if (baseCtx) {
      ctx = { ...this.vars, ...baseCtx }
    } else {
      ctx = this.vars
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
      if (m = obj.match(VariableManager._NavPattern)) {
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
