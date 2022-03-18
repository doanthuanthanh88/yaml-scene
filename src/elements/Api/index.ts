import { LogLevel } from "@app/utils/logger/LogLevel"
import { ProgressBar } from "@app/utils/progress-bar/ProgressBar"
import { ReaderProgressBar } from "@app/utils/progress-bar/ReaderProgressBar"
import { TimeUtils } from "@app/utils/time"
import Axios from "axios"
import chalk from "chalk"
import FormData from 'form-data'
import { createWriteStream } from "fs"
import { Agent } from 'http'
import { Agent as Agents } from 'https'
import merge from "lodash.merge"
import { stringify } from 'querystring'
import { ElementFactory } from "../ElementFactory"
import { ElementProxy } from "../ElementProxy"
import { IElement } from "../IElement"
import Validate from "../Validate"
import { Method } from "./Method"

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// axios.interceptors.request.use(function (config) {
//   // @ts-ignore
//   const urlParams = config['urlParams']
//   config.url = VarManager.Instance.get(config.url.replace(/(\:(\w+))/g, `$\{urlParams.$2\}`), { urlParams })
//   return config
// })

/**
 * @guide
 * @name Api
 * @description Send a request via http with custom method
 * @group Api
 * @order 3
 * @example
- Api:
    title: Update a product                                     # Api name
    description: It's only serve content for admin              # Api description
    doc: true                                                   # Push it to queue to export to doc in element `Doc/Api/MD`
    method: PUT                                                 # Request method (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)
    baseURL: http://localhost:3000                              
    url: /product/:id
    params:                                                     # Request params. (In the example, url is "/product/1")
      id: 1
    query:                                                      # Request querystring (In the example, url is appended "?order=name")
      order: name
    headers:                                                    # Request headers
      authorization: ...
    body: {                                                     # Request body which used in [POST, PUT, PATCH...] methods
      name: "thanh",
      file: !binary ./my_file.txt                               # Use !binary to upload a file to server (content-type: multipart/form-data)
    }
    timeout: 1s                                                 # Request timeout
    saveTo: /file_downloaded.txt                                # Request file from server then download and save to this path
    validate:                                                   # Validate response after request done. (Reference to #Validate)
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
 * @end
 */
export default class Api implements IElement {
  proxy: ElementProxy<Api>

  title: string
  description: string
  doc: boolean
  method: Method
  baseURL: string
  url: string
  timeout?: number
  query: any
  params: any
  headers: any
  body: any
  response: any
  error: any
  time: number
  var: any
  validate: ElementProxy<Validate>[]
  saveTo: string

  get fullUrl() {
    const urlParams = this.params
    return this.proxy.scenario.variableManager.get(this.url.replace(/(\:(\w+))/g, `$\{urlParams.$2\}`), { urlParams })
  }

  get contentType() {
    return this.headers['content-type'] || this.headers['Content-Type']
  }

  get responseContentType() {
    return this.response?.headers['content-type'] || this.response?.headers['Content-Type']
  }

  get curl() {
    const { CurlGenerator } = require('curl-generator')
    return CurlGenerator({
      method: this.method as any,
      headers: Object.keys(this.headers || {}).reduce((sum, e) => {
        sum[e] = (this.headers[e] || '').toString()
        return sum
      }, {}),
      body: this.body,
      url: this.fullUrl
    })
  }

  init(props: any) {
    merge(this, { method: Method.GET }, {
      ...props,
      validate: props.validate?.map(v => {
        const _v = ElementFactory.CreateElement<Validate>('Validate', this.proxy.scenario)
        v.changeLogLevel(props.logLevel)
        _v.init(v)
        _v._ = this.proxy._
        _v.__ = this.proxy.__
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
    this.timeout = this.proxy.getVar(this.timeout)
    if (this.timeout) {
      this.timeout = TimeUtils.GetMsTime(this.timeout)
    }
    this.url = this.proxy.getVar(this.url)
    this.params = this.proxy.getVar(this.params) || {}
    this.query = this.proxy.getVar(this.query) || {}
    this.headers = this.proxy.getVar(this.headers) || {}
    this.body = this.proxy.getVar(this.body)
    this.saveTo = this.proxy.getVar(this.saveTo)
    if (this.saveTo) {
      this.saveTo = this.proxy.resolvePath(this.saveTo)
    }
    if (!this.headers['content-type']) this.headers['content-type'] = 'application/json'
  }

  async exec() {
    const { method, baseURL, query, headers, body, params } = this
    try {
      this.proxy.logger.info(chalk.cyan.bold('‣', this.title), chalk.gray('-', `${this.method} ${this.url}`))
      console.group()
      this.time = Date.now()
      const axios = Axios.create({
        maxRedirects: Number.MAX_SAFE_INTEGER,
        withCredentials: true,
        httpAgent: new Agent(),
        httpsAgent: new Agents(),
        timeout: this.timeout

      })
      let { status, statusText, headers: responseHeaders, data } = await axios.request({
        responseType: this.saveTo ? 'stream' : undefined,
        method,
        baseURL,
        url: this.fullUrl,
        urlParams: params,
        params: query,
        headers,
        data: await (async () => {
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
              const progressBar = new ProgressBar('Upload Progress || {bar} | {percentage}% || {value}/{total} bytes || Speed: {speed}')
              progressBar.total = await new Promise<number>((resolve, reject) => {
                data.getLength((err, len) => {
                  if (err) return reject(err)
                  resolve(len)
                })
              })
              new ReaderProgressBar(data, 'Uploaded {value} bytes', progressBar)
              return data
            }
          }
          return body
        })(),
      } as any)
      if (this.saveTo) {
        new ReaderProgressBar(data, `Dowloaded {value} bytes`, new ProgressBar('Download Progress || {value} bytes || Speed: {speed}'))
        await new Promise((resolve, reject) => {
          const writer = createWriteStream(this.saveTo)
          data.pipe(writer)
          writer.on('error', reject)
          writer.on('close', resolve)
        })
        this.proxy.logger.debug(chalk.magenta(`- Response saved at "${this.saveTo}"`))
        data = new URL(this.saveTo, 'file://')
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
      this.printLog()
      if (this.error) {
        this.proxy.scenario.events.emit('api.done', false, this)
        throw this.error
      } else {
        this.proxy.scenario.events.emit('api.done', true, this)
      }
      console.groupEnd()
    }
  }

  private printLog() {
    if (this.proxy.logger.getLevel() <= LogLevel.TRACE) {
      console.group()
      this.proxy.logger.debug(`%s`, chalk.red.underline(this.curl))
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