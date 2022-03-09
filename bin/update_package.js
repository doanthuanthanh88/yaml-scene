const { writeFileSync, readFileSync, copyFileSync } = require('fs')
const { join } = require('path')

new Array('package.json', 'package-lock.json', 'yarn.lock', 'README.md', 'GUIDE.md')
  .forEach(file => {
    const fout = join(__dirname, '..', 'dist', file)
    const fin = join(__dirname, '..', file)
    if (file === 'package.json') {
      let json = readFileSync(fin).toString()
      json = json.replace(/^\s*"prepare"\:.+\n/m, '')
      writeFileSync(fout, json)
      return
    }
    copyFileSync(fin, fout)
  })
