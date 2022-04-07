exports.default = {
  name: 'ex1',
  proxy: undefined,
  init({ title }) {
    this.title = title
  },
  exec() {
    this.proxy.logger.info('echo 01', this.title)
  }
}