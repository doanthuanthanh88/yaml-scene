import Echo from ".";

export default class Red extends Echo {
  init(props: any): void {
    super.init(props)
    this.transforms.push({ Colorize: 'red' })
  }
}
