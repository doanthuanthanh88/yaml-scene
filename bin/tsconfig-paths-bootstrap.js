const path = require('path')
const merge = require('lodash.merge')

const curDir = path.resolve('.')
let config = require(path.join(curDir, 'tsconfig.json'))
if (config.extends) {
  const base = require(path.join(curDir, config.extends))
  config = merge({}, base, config)
}
const { compilerOptions } = config

const map = {}
for (let k in compilerOptions.paths) {
  map[k.replace('/*', '/')] = path.resolve(path.join(compilerOptions.baseUrl, compilerOptions.paths[k][0].replace('/*', '/')))
}
const mapKeys = Object.keys(map)

const _require = module.constructor.prototype.require
module.constructor.prototype.require = function (..._args) {
  const [basePath, ...args] = _args
  let filepath
  let sourcePath
  if ((sourcePath = mapKeys.find(e => basePath.startsWith(e)))) {
    let targetPath = map[sourcePath]
    targetPath = path.relative(path.dirname(this.filename), targetPath)
    if (!targetPath.startsWith('/')) targetPath = './' + targetPath
    filepath = basePath.replace(sourcePath, targetPath + '/')
  } else {
    filepath = basePath
  }
  return _require.apply(this, [filepath, ...args])
}