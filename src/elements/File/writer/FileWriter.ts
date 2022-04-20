import { FileUtils } from "@app/utils/FileUtils";
import { WriteFileOptions } from 'fs';
import { writeFile } from "fs/promises";
import { IFileWriter } from "./IFileWriter";

export class FileWriter implements IFileWriter {
  static readonly Initable = true

  constructor(public path: string, public config = {} as { encoding?: WriteFileOptions }) {
  }

  async write(data: any = '') {
    FileUtils.MakeDirExisted(this.path)
    await writeFile(this.path, data, this.config.encoding)
  }

}
