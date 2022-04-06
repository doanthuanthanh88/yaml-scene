exports.default = {
  init(extensionInputProps = {}) {
    // Init data
    // WARN: No async here
    Object.assign(this, extensionInputProps)
  },
  async prepare() {
    // Prepare data before execute  
  },
  async exec() {
    // Main execute function
    console.log('echo 01', this.title)
  },
  async dispose() {
    // Release resource
  }
}