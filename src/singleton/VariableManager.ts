import { ElementProxy } from "@app/elements/ElementProxy"
import { AES } from "@app/utils/encrypt/AES"
import { Base64 } from "@app/utils/encrypt/Base64"
import { MD5 } from "@app/utils/encrypt/MD5"
import { TraceError } from "@app/utils/error/TraceError"
import chalk from "chalk"
import { Scenario } from "./Scenario"
import { ScenarioEvent } from "./ScenarioEvent"

export class VariableManager {
  private static readonly _NavPattern = /^(\$\{){1}([^\}]+)\}$/
  // private static readonly _PreloadVarPattern = /^\(\s*\{[a-zA-Z0-9_$,\s]+\}\s*\)$/
  private static _Instance: VariableManager

  static get Instance() {
    if (!this._Instance) {
      Scenario.Instance.events.once(ScenarioEvent.RESET, () => {
        this._Instance = undefined
      })
      this._Instance = new VariableManager()
    }
    return this._Instance
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

  diffWithGlobalVar(varObj: any) {
    const newVars = Object.keys(varObj)
      .filter(key => VariableManager.Instance.vars[key] !== undefined)
      .reduce((sum, key) => {
        sum[key] = varObj[key]
        return sum
      }, {})
    return newVars
  }

  async replace(varObj: any, obj: any, defaultKey?: string) {
    const newVars = this.diffWithGlobalVar(varObj)
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
        if (!key.startsWith('$$')) {
          this.vars[key] = await this.get(vl, obj)
        }
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

  async eval(func?: string | Function, ctx = {} as any, mainContextProp?: string) {
    if (!func) throw new TraceError(`Could not eval with empty code`, { func })
    let _func: Function
    // const ctx = { ...this.vars, ...baseCtx }
    // func = func.trim()
    // let isAsync = ''
    // if (!func.startsWith('return ')) {
    //   if (func.includes('await ') || func.includes('Promise.') || func.includes('new Promise')) {
    //     isAsync = 'async'
    //   }
    // }
    // const [firstLine] = func.split('\n', 1)
    // let args: string
    // if (firstLine && VariableManager._PreloadVarPattern.test(firstLine)) {
    //   func = func.substring(firstLine.length)
    //   args = firstLine
    // } else {
    //   args = `({${Object.keys(ctx).join(',')}})`
    // }
    // const evalStr = `vl = (${isAsync}${args} => {\n${func}\n}).call(${ctx[mainContextProp] || 'null'}, ctx)`
    if (typeof func === 'string') {
      eval(`_func = ${func}`) as Function
    }
    return _func.call(ctx[mainContextProp] || null, ctx)
  }

  async get(obj: any, ctx?: any) {
    if (!obj) return obj
    if (Array.isArray(obj)) {
      // const ctx = isPassed ? baseCtx : { ...this.vars, ...baseCtx }
      obj = await Promise.all(obj.map(o => this.get(o, ctx)))
    } else if (typeof obj === 'object') {
      if (obj instanceof Promise) {
        obj = await obj
      }
      if (obj instanceof ElementProxy) {
        await obj.prepare()
        obj = await obj.exec()
        return obj
      } else {
        // const ctx = isPassed ? baseCtx : { ...this.vars, ...baseCtx }
        for (const [key, vl] of Object.entries(obj)) {
          obj[key] = await this.get(vl, ctx)
        }
      }
    } else if (this.isIncludeFormula(obj)) {
      let vl;
      // const ctx = isPassed ? baseCtx : { ...this.vars, ...baseCtx }
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
