import Echo from ".";

export default class Cyan extends Echo {
  init(props: any): void {
    super.init(props)
    this.transforms.push({ Colorize: 'cyan' })
  }
}
