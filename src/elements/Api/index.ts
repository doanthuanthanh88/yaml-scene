import Axios from "axios"
import chalk from "chalk"
import FormData from 'form-data'
import { merge } from "lodash"
import { stringify } from 'querystring'
import { VarManager } from "../../singleton/VarManager"
import { ElementFactory } from "../ElementFactory"
import { ElementProxy } from "../ElementProxy"
import { Validate } from "../Validate"
import { Method } from "./Method"

const axios = Axios.create()
axios.interceptors.request.use(function (config) {
  // @ts-ignore
  const urlParams = config['urlParams']
  config.url = VarManager.Instance.get(config.url.replace(/(\:(\w+))/g, `$\{urlParams.$2\}`), { urlParams })
  return config
})

export class Api {
  proxy: ElementProxy<Api>

  title: string
  description: string
  method: Method
  baseURL: string
  url: string
  query: any
  params: any
  headers: any
  body: any
  response: any
  error: any
  time: number
  var: any
  validate: ElementProxy<Validate>[]
  debug: boolean

  init(props: any) {
    merge(this, { method: Method.GET }, {
      ...props,
      validate: props.validate?.map(v => {
        const _v = ElementFactory.CreateElement<Validate>('Validate', this.proxy.tc)
        _v.init(v)
        return _v
      })
    })
  }

  prepare() {
    this.validate?.forEach(_v => {
      _v._ = this
      _v.__ = this.proxy.__
    })
    this.debug = this.proxy.getVar(this.debug)
    this.title = this.proxy.getVar(this.title)
    this.description = this.proxy.getVar(this.description)
    this.baseURL = this.proxy.getVar(this.baseURL) || ''
    this.url = this.proxy.getVar(this.url)
    this.params = this.proxy.getVar(this.params) || {}
    this.query = this.proxy.getVar(this.query) || {}
    this.headers = this.proxy.getVar(this.headers) || {}
    this.body = this.proxy.getVar(this.body)
  }

  async exec() {
    const { method, baseURL, url, query, headers, body, params } = this
    try {
      console.group(chalk.magenta('▪', this.title), chalk.gray('-', `${this.method} ${this.url}`))
      this.time = Date.now()
      const { status, statusText, headers: responseHeaders, data } = await axios.request({
        method,
        baseURL,
        url,
        urlParams: params,
        params: query,
        headers,
        data: (() => {
          if (body) {
            if (this.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
              const data = new URLSearchParams()
              for (let k in body) {
                data.append(k, body[k])
              }
              return data
            }
            if (this.headers['content-type']?.includes('multipart/form-data')) {
              const data = new FormData()
              for (let k in body) {
                data.append(k, body[k])
              }
              merge(this.headers, data.getHeaders())
              return data
            }
          }
          return body
        })(),
      } as any)
      this.time = Date.now() - this.time
      this.response = {
        status,
        statusText,
        headers: responseHeaders,
        data
      }
    } catch (err) {
      this.time = Date.now() - this.time
      this.error = err
      if (err.response) {
        const { status, statusText, headers: responseHeaders, data } = err.response
        this.response = {
          status,
          statusText,
          headers: responseHeaders,
          data
        }
      }
    } finally {
      if (this.response) {
        console.log(chalk.magenta(' ', `${this.response.status}`), chalk.gray(`- ${this.time}ms`))
      }
      if (this.response) {
        try {
          await this.validateAPI()
          this.error = undefined
          this.applyToVar()
        } catch (err) {
          this.error = err
        }
      }
      this.printDebug()
      if (this.error) {
        this.proxy.tc.events.emit('Api.done', false)
        throw this.error
      } else {
        this.proxy.tc.events.emit('Api.done', true)
      }
      console.groupEnd()
    }
  }

  private printDebug() {
    if (this.debug || this.error) {
      console.log()
      let fullUrl = `${this.baseURL}${this.url}`
      if (Object.keys(this.query).length) fullUrl += '?' + stringify(this.query)
      console.log(chalk.red('REQUEST - %s %s'), this.method, fullUrl)

      const reqHeaders = Object.keys(this.headers)
      if (reqHeaders.length) {
        console.log()
        reqHeaders.forEach(k => console.log(chalk.redBright.italic(`• ${k}: ${this.headers[k]}`)))
      }
      // Request body
      if (this.body) {
        console.log()
        console.log(this.body)
      }
      console.log()

      const res = this.response
      if (res) {
        console.log(chalk.green('%s'), `RESPONSE - ${res.status} ${res.statusText}`)
        // Response headers
        const resHeaders = Object.keys(res.headers)
        if (resHeaders.length > 0) {
          console.log()
          resHeaders.forEach(k => console.log(chalk.greenBright.italic(`• ${k}: ${res.headers[k]}`)))
        }
        // Response data
        if (res.data) {
          console.log()
          console.log(res.data)
        }
      } else {
        console.log(chalk.green('%s'), `RESPONSE - ${this.error.message}`)
      }
      console.log()
    }
  }

  private async validateAPI() {
    if (this.validate?.length) {
      for (const v of this.validate) {
        await v.prepare()
        await v.exec()
      }
    }
  }

  private applyToVar() {
    if (this.var && this.response) {
      this.proxy.setVar(this.var, this, 'data')
    }
  }

}