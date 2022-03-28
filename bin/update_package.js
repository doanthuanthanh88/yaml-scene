const { writeFileSync, readFileSync, copyFileSync, existsSync } = require('fs')
const { join } = require('path')

const flout = join(__dirname, '..', 'dist')
if (existsSync(flout)) {
  new Array('package.json', 'yarn.lock', 'schema.json', 'schema.yas.json', '.npmignore', 'README.md', 'GUIDE.md')
    .forEach(file => {
      const fin = join(__dirname, '..', file)
      if (existsSync(fin)) {
        const fout = join(flout, file)
        if (file === 'package.json') {
          let json = readFileSync(fin).toString()
          json = json.replace(/^\s*"prepare"\:.+\n/m, '')
          writeFileSync(fout, json)
          return
        }
        copyFileSync(fin, fout)
      }
    })
}