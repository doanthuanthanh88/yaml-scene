import { ElementProxy } from "@app/elements/ElementProxy"
import { AES } from "@app/utils/encrypt/AES"
import { Base64 } from "@app/utils/encrypt/Base64"
import { MD5 } from "@app/utils/encrypt/MD5"
import { TraceError } from "@app/utils/error/TraceError"
import chalk from "chalk"

export class VariableManager {
  private static readonly _NavPattern = /^(\$\{){1}([^\}]+)\}$/
  private static _Instance: VariableManager | null

  static get Instance() {
    return this._Instance || (this._Instance = new VariableManager())
  }

  readonly vars = {} as { [key: string]: any }

  constructor() {
    this.vars = {
      get $$base64() {
        return Base64.Instance
      },
      get $$md5() {
        return MD5.Instance
      },
      get $$aes() {
        return AES.Instance
      },
      get $$text() {
        return chalk
      },
    }
  }

  reset() {
    VariableManager._Instance = null
  }

  init(initVar?: any) {
    if (initVar) {
      Object.assign(this.vars, initVar)
    }
  }

  declare(varObj: any) {
    if (typeof varObj === 'string') {
      if (this.vars[varObj] === undefined) this.vars[varObj] = undefined
    } else if (varObj && typeof varObj === 'object') {
      Object.keys(varObj).forEach(key => {
        if (this.vars[key] === undefined) this.vars[key] = varObj[key]
      })
    }
  }

  async replace(varObj: any, obj: any, defaultKey?: string) {
    const newVars = Object.keys(varObj)
      .filter(key => VariableManager.Instance.vars[key] !== undefined)
      .reduce((sum, key) => {
        sum[key] = varObj[key]
        return sum
      }, {})
    await this.set(newVars, obj, defaultKey)
  }

  async set(varObj: any, obj: any, defaultKey?: string) {
    // if (!obj) return
    if (typeof varObj === 'string') {
      if (defaultKey) {
        this.vars[varObj] = eval(`obj.${defaultKey}`)
      } else {
        this.vars[varObj] = obj
      }
    } else if (varObj && typeof varObj === 'object') {
      for (const [key, vl] of Object.entries(varObj)) {
        this.vars[key] = await this.get(vl, obj)
      }
    } else {
      const error = new TraceError('VariableManager.set() only support "string" or "object" type', {
        varObj,
        obj,
        defaultKey
      })
      throw error
    }
  }

  async eval(func?: string, baseCtx?: any) {
    if (!func) throw new TraceError(`Could not eval with empty code`, { func })
    let vl;
    const ctx = { ...this.vars, ...baseCtx }
    const isAsync = func.includes('await ')
    const evalStr = `vl = (${isAsync ? 'async' : ''}({${Object.keys(ctx).join(',')}}) => { 
        ${func}
      })(ctx)`
    eval(evalStr)
    return vl
  }

  async get(obj: any, baseCtx?: any, isPassed?: boolean) {
    if (!obj) return obj
    if (Array.isArray(obj)) {
      const ctx = isPassed ? baseCtx : { ...this.vars, ...baseCtx }
      obj = await Promise.all(obj.map(o => this.get(o, ctx, true)))
    } else if (obj instanceof ElementProxy) {
      await obj.prepare()
      obj = await obj.exec()
      return obj
    } else if (typeof obj === 'object') {
      const ctx = isPassed ? baseCtx : { ...this.vars, ...baseCtx }
      for (const [key, vl] of Object.entries(obj)) {
        obj[key] = await this.get(vl, ctx, true)
      }
    } else if (this.isIncludeFormula(obj)) {
      let vl;
      const ctx = isPassed ? baseCtx : { ...this.vars, ...baseCtx }
      let evalStr = `let {${Object.keys(ctx).join(',')}} = ctx;\n`
      const m = obj.match(VariableManager._NavPattern)
      if (m) {
        evalStr += `vl = ${m[2]}`
      } else {
        evalStr += `vl = \`${obj}\``
      }
      eval(evalStr)
      return vl
    }
    return obj
  }

  isIncludeFormula(obj: any) {
    return typeof obj === 'string' && obj.includes('${')
  }
}
