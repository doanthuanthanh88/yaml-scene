import Echo from ".";

export default class Blue extends Echo {
  init(props: any): void {
    super.init(props)
    this.transforms.push({ Colorize: 'blue' })
  }
}
