import { Base64 } from "@app/utils/encrypt/Base64"
import chalk from "chalk"

export class VarManager {
  static readonly Instance = new VarManager()

  private readonly _navPattern = /^(\$\{){1}([^\}]+)\}$/
  globalVars = {
    get $$base64() {
      return Base64.GetInstance()
    },
    get $$color() {
      return chalk
    }
  } as { [key: string]: any }

  set(varObj: any, obj: any, defaultKey?: string) {
    // if (!obj) return
    if (typeof varObj === 'string') {
      const vl = this.get(defaultKey ? eval(`obj.${defaultKey}`) : obj)
      this.globalVars[varObj] = vl
    } else if (varObj && typeof varObj === 'object') {
      Object.keys(varObj).forEach(key => {
        const vl = this.get(varObj[key], { _: obj })
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
      const evalStr = `vl = (({${Object.keys(ctx).join(',')}}) => { 
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