import { LazyImport } from "@app/utils/LazyImport";
import { IFileWriter } from "./IFileWriter";

/*****
@name Csv 
@description Write a csv file. Used in File/Writer
@group File/Writer.Adapter
@example
- File/Writer:
    title: Write to csv file
    path: assets/data2.csv
    adapters:                       
      - Csv 
    content: 
      - name: name 1
        age: 1
      - name: name 2
        age: 3
*/
export class CsvWriter implements IFileWriter {
  constructor(private file: IFileWriter) { }

  async write(data: any) {
    const { default: stringify } = await LazyImport(import('csv-stringify/lib/sync'))
    const rs = stringify(data)
    await this.file.write(rs)
  }

}