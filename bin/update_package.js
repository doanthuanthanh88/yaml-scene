const { writeFileSync, readFileSync, copyFileSync, existsSync, mkdirSync } = require('fs')
const { join, dirname } = require('path')

const flout = join(__dirname, '..', 'dist')
if (existsSync(flout)) {
  new Array('package.json', 'bin/cli.js', 'yarn.lock', 'schema.json', 'schema.yas.json', '.npmignore', 'README.md', 'GUIDE.md')
    .forEach(file => {
      const fin = join(__dirname, '..', file)
      if (existsSync(fin)) {
        const fout = join(flout, file)
        if (file === 'package.json') {
          let json = readFileSync(fin).toString()
          json = json.replace(/^\s*"prepare"\:.+\n/m, '')
          writeFileSync(fout, json)
          return
        } else if (file.includes('/')) {
          mkdirSync(dirname(fout), { recursive: true })
        }
        copyFileSync(fin, fout)
      }
    })
}