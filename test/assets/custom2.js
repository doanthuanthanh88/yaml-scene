exports.default = class Ex2 {
  init({ title }) {
    this.title = title
  }
  exec() {
    this.proxy.logger.info('echo 02', this.title)
  }
}