export class Clear {
  exec() {
    console.clear()
  }

  clone() {
    return this as any
  }
}