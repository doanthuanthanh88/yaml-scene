const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')
const packageFile = join(__dirname, '..', 'dist/package.json')
let json = readFileSync(packageFile).toString()
json = json.replace(/^\s*"prepare"\:.+\n/m, '')
writeFileSync(packageFile, json)