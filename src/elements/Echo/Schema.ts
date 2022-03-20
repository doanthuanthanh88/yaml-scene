import Echo from ".";

export default class Schema extends Echo {
  init(props: any): void {
    super.init(props)
    this.transforms.splice(0, 0, 'Schema')
  }
}
