import merge from "lodash.merge";
import { ElementFactory } from "../../../elements/ElementFactory";
import { ElementProxy } from "../../../elements/ElementProxy";
import Reader from "../../../elements/File/Reader";
import { IElement } from "../../../elements/IElement";

/*****
@name !tag file
@description Transform file/URL to a file reader which includes adapters
- File in local path
- File from url
@group !Tags
@example
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file1: !tag
        file: 
          path: ~/data.json
          adapters: 
            - Json
      file2: !tag
        file: 
          path: https://raw....
          adapters: 
            - Text
*/
export default class file implements IElement {
  proxy: ElementProxy<this>;
  $$: IElement;
  $: this;

  private _reader: ElementProxy<Reader>

  public path: string
  public adapters: (string | any)[]

  init(props: { path: string, adapters?: (string | any)[] }) {
    merge(this, props)
  }

  async prepare() {
    this._reader = ElementFactory.CreateTheElement<Reader>(Reader)
    this._reader.init({
      path: this.path,
      adapters: this.adapters
    })
    await this._reader.prepare()
  }

  exec() {
    return this._reader.exec()
  }
}