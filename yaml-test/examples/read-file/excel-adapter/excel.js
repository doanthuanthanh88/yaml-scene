const readXlsxFile = require('read-excel-file/node')
const { Readable } = require('stream')

exports.default = class Excel {
  constructor(file, sheet) {
    this.file = file
    this.sheet = sheet
  }

  async read() {
    const cnt = await this.file.read()
    const reader = new Readable()
    reader.push(cnt)
    reader.push(null)
    const rows = await readXlsxFile(reader, this.sheet && { sheet: this.sheet })
    return rows
  }

  write(data) {
    return this.file.write(JSON.stringify(data))
  }
}