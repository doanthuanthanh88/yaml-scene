import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import { WriteFileOptions } from "fs";
import { File } from "./File";
import { IFileAdapter } from "./IFileAdapter";
import { Url } from "./Url";

export class Resource implements IFileAdapter {
  private existed: boolean | 'url'
  private _adapter: IFileAdapter

  get isFile() {
    return this.existed === true
  }

  constructor(public path: string, public config = {} as { encoding?: WriteFileOptions, readType?: 'stream' | 'buffer' }) {
    this.existed = FileUtils.Existed(this.path)
    if (!this.existed) {
      throw new TraceError(`"${this.path}" is not valid`)
    }
    this._adapter = this.existed === 'url' ? new Url(this.path, this.config) : new File(this.path, this.config)
  }

  async read() {
    return this._adapter.read()
  }

  async write(data: any) {
    return this._adapter.write(data)
  }

}
