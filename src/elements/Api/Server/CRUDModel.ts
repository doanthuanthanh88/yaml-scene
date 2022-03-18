export class CRUDModel {
  private list: any[];

  constructor() {
    this.list = new Array();
  }

  find(where?: any) {
    const fields = Object.keys(where || {});
    if (!fields.length)
      return this.list;

    return this.list.filter(item => {
      return fields.every(field => item[field]?.toString() === where[field]?.toString());
    });
  }
  get(field: string, id: string) {
    const item = this.list.find(e => e[field].toString() === id.toString());
    return item;
  }
  create(value) {
    this.list.push(value);
    return value;
  }
  update(field: string, id: string, value: any) {
    const idx = this.list.findIndex(e => e[field].toString() === id.toString());
    if (idx === -1)
      throw new Error(`Could not found ${id} to update`);
    this.list[idx] = value;
    return value;
  }
  patch(field: string, id: string, value: any) {
    const idx = this.list.findIndex(e => e[field].toString() === id.toString());
    if (idx === -1)
      throw new Error(`Could not found ${id} to update`);
    Object.keys(value).forEach(key => this.list[idx][key] = value[key]);
    return this.list[idx];
  }
  remove(field: string, id: string) {
    const idx = this.list.findIndex(e => e[field].toString() === id.toString());
    if (idx === -1)
      throw new Error(`Could not found ${id} to remove`);
    this.list.splice(idx, 1);
    return null;
  }
}
