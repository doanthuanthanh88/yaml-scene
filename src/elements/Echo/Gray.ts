import Echo from ".";

export default class Gray extends Echo {
  init(props: any): void {
    super.init(props)
    this.transforms.push({ Colorize: 'gray' })
  }
}
