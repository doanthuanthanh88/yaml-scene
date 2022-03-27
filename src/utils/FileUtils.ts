import { readFileSync } from 'fs'
import http from 'http'
import https from 'https'
import { parse, stringify } from 'querystring'

export enum UrlPathType {
  URL = 1,
  LOCAL = 2
}

export class FileUtils {
  static async GetContentFromUrlOrPath(urlOrPath: string) {
    if (FileUtils.GetPathType(urlOrPath) === UrlPathType.URL) {
      const content = await new Promise<Buffer>((resolve, reject) => {
        const req = urlOrPath.startsWith('https://') ? https : http
        const [path, query = ''] = urlOrPath.split('?')
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
    return readFileSync(urlOrPath)
  }

  static GetPathType(urlOrPath: string) {
    return /^https?:\/\//.test(urlOrPath) ? UrlPathType.URL : UrlPathType.LOCAL
  }
}