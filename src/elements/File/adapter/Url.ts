import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { StringUtils } from "@app/utils/StringUtils";
import http from 'http';
import https from 'https';
import merge from "lodash.merge";
import { parse, stringify } from "querystring";
import { Readable } from "stream";
import { IFileAdapter } from "./IFileAdapter";

export class Url implements IFileAdapter {
  static readonly Initable = true

  constructor(public link: string, public config = {} as { readType?: 'stream' | 'buffer' }) {
    if (!link) {
      throw new TraceError(`"Link" is required`)
    }
    this.config = merge({ readType: 'buffer' }, this.config)
  }

  async read() {
    if (!FileUtils.Existed(this.link)) throw new TraceError(`"${this.link}" is not valid`)
    switch (this.config.readType) {
      case 'buffer':
        return this.getBufferFromUrl(this.link)
      case 'stream':
        return this.getStreamFromUrl(this.link)
      default:
        throw new TraceError(`Adapter "File" is not support "readType" is "${this.config.readType}"`)
    }
  }

  async write(_data: any = '') {
    throw new TraceError(`Url adapter not support to write`)
  }

  private async getBufferFromUrl(urlStr: string) {
    const content = await new Promise<Buffer>((resolve, reject) => {
      const req = urlStr.startsWith('https://') ? https : http
      const [path, query] = StringUtils.Split2(urlStr, '?')
      const { headers = '{}', ...queries } = parse(query) as any

      const url = `${path}${Object.keys(queries).length ? '?' : ''}${stringify(queries)}`
      req.get(url, {
        headers: JSON.parse(headers)
      }, response => {
        const data = new Array<Buffer>()
        response.on('data', (chunk) => {
          data.push(chunk)
        })
        response.on('end', () => {
          resolve(Buffer.concat(data))
        })
        response.on('error', reject)
      });
    })
    return content
  }

  private async getStreamFromUrl(urlStr: string) {
    const content = await new Promise<Readable>((resolve) => {
      const req = urlStr.startsWith('https://') ? https : http
      const [path, query] = StringUtils.Split2(urlStr, '?')
      const { headers = '{}', ...queries } = parse(query) as any

      const url = `${path}${Object.keys(queries).length ? '?' : ''}${stringify(queries)}`
      req.get(url, {
        headers: JSON.parse(headers)
      }, response => {
        resolve(response)
      });
    })
    return content
  }

}
