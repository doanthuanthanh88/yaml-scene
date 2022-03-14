exports.echo1 = {
  exec() {
    console.log('echo 01', this.title)
  }
}
exports.echo2 = {
  init() {

  },
  exec() {
    console.log('echo 02', this.title)
  }
}