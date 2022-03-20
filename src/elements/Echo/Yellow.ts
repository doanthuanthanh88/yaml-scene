import Echo from ".";

export default class Yellow extends Echo {
  init(props: any): void {
    super.init(props)
    this.transforms.push({ Colorize: 'yellow' })
  }
}
