import { TestCase } from "@app/TestCase"
import { LogLevel } from "@app/utils/logger/LogLevel"
import { ProgressBar } from "@app/utils/progress-bar/ProgressBar"
import { ReaderProgressBar } from "@app/utils/progress-bar/ReaderProgressBar"
import Axios from "axios"
import chalk from "chalk"
import FormData from 'form-data'
import { createWriteStream } from "fs"
import { merge } from "lodash"
import { stringify } from 'querystring'
import { VarManager } from "../../singleton/VarManager"
import { ElementFactory } from "../ElementFactory"
import { ElementProxy } from "../ElementProxy"
import { Validate } from "../Validate"
import { Method } from "./Method"

const axios = Axios.create()
// axios.interceptors.request.use(function (config) {
//   // @ts-ignore
//   const urlParams = config['urlParams']
//   config.url = VarManager.Instance.get(config.url.replace(/(\:(\w+))/g, `$\{urlParams.$2\}`), { urlParams })
//   return config
// })

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
  saveTo: string

  get fullUrl() {
    const urlParams = this.params
    return VarManager.Instance.get(this.url.replace(/(\:(\w+))/g, `$\{urlParams.$2\}`), { urlParams })
  }

  init(props: any) {
    merge(this, { method: Method.GET }, {
      ...props,
      validate: props.validate?.map(v => {
        const _v = ElementFactory.CreateElement<Validate>('Validate', this.proxy.tc)
        v['logLevel'] = props['logLevel']
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
    this.title = this.proxy.getVar(this.title)
    this.description = this.proxy.getVar(this.description)
    this.baseURL = this.proxy.getVar(this.baseURL) || ''
    this.url = this.proxy.getVar(this.url)
    this.params = this.proxy.getVar(this.params) || {}
    this.query = this.proxy.getVar(this.query) || {}
    this.headers = this.proxy.getVar(this.headers) || {}
    this.body = this.proxy.getVar(this.body)
    this.saveTo = this.proxy.getVar(this.saveTo)
    if (this.saveTo) {
      this.saveTo = TestCase.GetPathFromRoot(this.saveTo)
    }
  }

  private get contentType() {
    return this.headers['content-type'] || this.headers['Content-Type']
  }

  async exec() {
    const { method, baseURL, query, headers, body, params } = this
    try {
      this.proxy.logger.info(chalk.cyan.bold('‣', this.title), chalk.gray('-', `${this.method} ${this.url}`))
      console.group()
      this.time = Date.now()
      let { status, statusText, headers: responseHeaders, data } = await axios.request({
        responseType: this.saveTo ? 'stream' : undefined,
        method,
        baseURL,
        url: this.fullUrl,
        urlParams: params,
        params: query,
        headers,
        data: (() => {
          if (body) {
            if (this.contentType?.includes('application/x-www-form-urlencoded')) {
              const data = new URLSearchParams()
              for (let k in body) {
                data.append(k, body[k])
              }
              return data
            }
            if (this.contentType?.includes('multipart/form-data')) {
              const data = new FormData()
              for (let k in body) {
                data.append(k, body[k])
              }
              merge(this.headers, data.getHeaders())
              new ReaderProgressBar(data, 'Uploaded {value} bytes', new ProgressBar('Upload Progress || {value} bytes || Speed: {speed}'))
              return data
            }
          }
          return body
        })(),
      } as any)
      if (this.saveTo) {
        const writer = createWriteStream(this.saveTo);
        new ReaderProgressBar(data, `Dowloaded {value} bytes`, new ProgressBar('Download Progress || {value} bytes || Speed: {speed}'))
        data.pipe(writer);
        data = await new Promise((resolve, reject) => {
          writer.on('finish', () => {
            this.proxy.logger.debug(chalk.magenta(`- Response saved at "${this.saveTo}"`))
            resolve(new URL(this.saveTo, 'file://'))
          })
          writer.on('error', reject)
        })
      }
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
        this.proxy.logger.info('%s %s', chalk[this.error ? 'red' : 'green'](`${this.response.status} ${this.response.statusText}`), chalk.gray(` (${this.time}ms)`))
        try {
          await this.validateAPI()
          this.error = undefined
          this.applyToVar()
        } catch (err) {
          this.error = err
          this.proxy.changeLogLevel('debug')
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
    if (this.proxy.logger.getLevel() <= LogLevel.DEBUG) {
      console.group()
      let fullUrl = `${this.baseURL}${this.fullUrl}`
      if (Object.keys(this.query).length) fullUrl += '?' + stringify(this.query, null, null, { encodeURIComponent: str => str })
      this.proxy.logger.debug('%s', chalk.red.bold('* Request * * * * * * * * * *'))
      console.group()
      this.proxy.logger.debug('%s: %s', chalk.magenta('* Method'), this.method)
      this.proxy.logger.debug('%s: %s', chalk.magenta('* URL'), fullUrl)

      const reqHeaders = Object.keys(this.headers)
      if (reqHeaders.length) {
        this.proxy.logger.debug('%s: ', chalk.magenta('* Headers'))
        console.group()
        reqHeaders.forEach(k => this.proxy.logger.debug(`• %s: %s`, chalk.magenta(k), this.headers[k]))
        console.groupEnd()
      }
      // Request body
      if (this.body) {
        this.proxy.logger.debug('%s: ', chalk.magenta('* Body'))
        this.proxy.logger.debug(this.body)
      }
      console.groupEnd()
      this.proxy.logger.debug('%s', chalk.red.bold('* Response * * * * * * * * * *'))
      const res = this.response
      if (res) {
        console.group()
        this.proxy.logger.debug('%s: %s - %s', chalk.magenta('* Status'), res.status, res.statusText)
        // Response headers
        const resHeaders = Object.keys(res.headers)
        if (resHeaders.length > 0) {
          this.proxy.logger.debug('%s: ', chalk.magenta('* Headers'))
          console.group()
          resHeaders.forEach(k => this.proxy.logger.debug(`• %s: %s`, chalk.magenta(k), res.headers[k]))
          console.groupEnd()
        }
        // Response data
        if (res.data) {
          this.proxy.logger.debug('%s: ', chalk.magenta('* Data'))
          this.proxy.logger.debug(res.data)
        }
        console.groupEnd()
      }
      console.groupEnd()
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
      this.proxy.setVar(this.var, this, 'response.data')
    }
  }

}