import { existsSync } from "fs"
import { dirname, join } from "path"
import { ExtensionNotFound } from "./error/ExtensionNotFound"

export async function LazyImport(imports: Promise<any>) {
  try {
    const rs = await imports
    return rs
  } catch (err: any) {
    if (err?.code === 'MODULE_NOT_FOUND') {
      const [, name] = err.message.toString().match(/['"]([^"']+)'/)
      const [packageName] = name.split('/')
      let [errPath] = err.requireStack || []
      if (errPath) {
        err = new ExtensionNotFound(name, `The scenario is use package "${packageName}"`, 'local')
        errPath = dirname(errPath)
        let i = 10
        while (i-- > 0) {
          if (existsSync(join(errPath, 'package.json'))) {
            err.localPath = errPath
            break
          }
          errPath = join(errPath, '..')
        }
      }
    }
    throw err
  }
}
