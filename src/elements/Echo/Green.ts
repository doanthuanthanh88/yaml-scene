import Echo from ".";

export default class Green extends Echo {
  init(props: any): void {
    super.init(props)
    this.transforms.push({ Colorize: 'green' })
  }
}
