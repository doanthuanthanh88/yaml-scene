import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import http from 'http';
import https from 'https';
import { parse, stringify } from "querystring";
import { Readable } from "stream";
import { IFileAdapter } from "./IFileAdapter";

export class Url implements IFileAdapter {

  constructor(public link: string, public readType = 'buffer' as 'stream' | 'buffer') {
    if (!link) {
      throw new TraceError(`"Link" is required`)
    }
  }

  async read() {
    if (!FileUtils.Existed(this.link)) throw new TraceError(`"${this.link}" is not valid`)
    return this.readType === 'buffer' ? this.getBufferFromUrl(this.link) : this.getStreamFromUrl(this.link)
  }

  async write(_data: any = '') {
    throw new TraceError(`Url adapter not support to write`)
  }

  private async getBufferFromUrl(urlStr: string) {
    const content = await new Promise<Buffer>((resolve, reject) => {
      const req = urlStr.startsWith('https://') ? https : http
      const [path, query = ''] = urlStr.split('?')
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
      const [path, query = ''] = urlStr.split('?')
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
