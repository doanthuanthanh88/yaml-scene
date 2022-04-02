import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { ElementProxy } from "../ElementProxy";
import { IFileAdapter } from "../File/adapter/IFileAdapter";
import { Resource } from "../File/adapter/Resource";
import { IElement } from "../IElement";

/**
 * @guide
 * @name !tag tags/binary
 * @description Transform file/URL to binary
- File in local path
- File from url
 * @group !Tags
 * @example
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file1: !tag
        tags/binary: ~/data.json
      file2: !tag
        tags/binary: https://raw....
 * @end
 */
export default class binary implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  file: string

  private _adapter: IFileAdapter

  init(file: string) {
    this.file = file
  }

  async prepare() {
    await this.proxy.applyVars(this, 'file')
    this.file = this.proxy.resolvePath(this.file)
    if (!FileUtils.Existed(this.file)) {
      throw new TraceError(`File "${this.file}" is not found`)
    }
    this._adapter = new Resource(this.file, 'stream')
  }

  exec() {
    return this._adapter.read()
  }
}