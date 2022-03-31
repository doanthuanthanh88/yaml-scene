import { ExtensionNotFound } from "./error/ExtensionNotFound"

const _require = module.constructor.prototype.require
module.constructor.prototype.require = function (...args) {
  try {
    return _require.apply(this, args)
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') throw err
    const [, name] = err.message.toString().match(/['"]([^"']+)'/)
    const [packageName] = name.split('/')
    throw new ExtensionNotFound(name, `The scenario is use package "${packageName}"`, 'local')
  }
}
