import { TraceError } from "@app/utils/error/TraceError";
import { createReadStream, existsSync } from "fs";
import { ElementProxy } from "../ElementProxy";
import { IElement } from "../IElement";

/**
 * @guide
 * @name !tag tags/binary
 * @description Transform file to binary
 * @group !Tags
 * @example
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file: !tag
        tags/binary: ~/data.json
 * @end
 */
export default class binary implements IElement {
  proxy: ElementProxy<binary>
  file: string

  init(file: string) {
    this.file = file
  }

  async prepare() {
    this.file = await this.proxy.getVar(this.file)
    this.file = this.proxy.resolvePath(this.file)
    if (!existsSync(this.file)) throw new TraceError(`File ${this.file} is not found`)
  }

  exec() {
    return createReadStream(this.file)
  }
}