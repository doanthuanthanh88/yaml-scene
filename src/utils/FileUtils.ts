import { existsSync, mkdirSync, rmSync } from 'fs'
import { dirname } from 'path'

export class FileUtils {

  // static async GetStreamFromUrlOrPath(urlOrPath: string) {
  //   const existed = FileUtils.Existed(urlOrPath)
  //   if (!existed) throw new TraceError(`File "${urlOrPath}" is not existed`)
  //   if (existed === 'url') {
  //     const content = await new Promise<Readable>((resolve) => {
  //       const req = urlOrPath.startsWith('https://') ? https : http
  //       const [path, query = ''] = urlOrPath.split('?')
  //       const { headers = '{}', ...queries } = parse(query) as any

  //       const url = `${path}${Object.keys(queries).length ? '?' : ''}${stringify(queries)}`
  //       req.get(url, {
  //         headers: JSON.parse(headers)
  //       }, response => {
  //         resolve(response)
  //       });
  //     })
  //     return content
  //   }
  //   return createReadStream(urlOrPath)
  // }

  // static async GetContentFromUrlOrPath(urlOrPath: string) {
  //   const existed = FileUtils.Existed(urlOrPath)
  //   if (!existed) throw new TraceError(`File "${urlOrPath}" is not existed`)
  //   if (existed === 'url') {
  //     const content = await new Promise<Buffer>((resolve, reject) => {
  //       const req = urlOrPath.startsWith('https://') ? https : http
  //       const [path, query = ''] = urlOrPath.split('?')
  //       const { headers = '{}', ...queries } = parse(query) as any

  //       const url = `${path}${Object.keys(queries).length ? '?' : ''}${stringify(queries)}`
  //       req.get(url, {
  //         headers: JSON.parse(headers)
  //       }, response => {
  //         const data = new Array<Buffer>()
  //         response.on('data', (chunk) => {
  //           data.push(chunk)
  //         })
  //         response.on('end', () => {
  //           resolve(Buffer.concat(data))
  //         })
  //         response.on('error', reject)
  //       });
  //     })
  //     return content
  //   }
  //   return readFile(urlOrPath)
  // }

  static MakeDirExisted(path: string, type = 'file' as 'file' | 'dir') {
    if (!existsSync(path)) {
      const dir = type === 'file' ? dirname(path) : path
      mkdirSync(dir, { recursive: true })
    }
  }

  static RemoveFilesDirs(path: string) {
    existsSync(path) && rmSync(path, { recursive: true, force: true })
  }

  static Existed(path: string) {
    if (!path) return false
    if (/^https?:\/\//.test(path)) return 'url'
    return existsSync(path)
  }

}