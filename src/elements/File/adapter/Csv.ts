import { LazyImport } from "@app/utils/LazyImport";
import { IFileAdapter } from "./IFileAdapter";

/**
 * @guide
 * @name Csv 
 * @description Read and write csv file. Used in File/Writer, File/Reader
 * @group File, File.Adapter
 * @example
- File/Reader:
    title: Read a csv file
    path: assets/data1.csv
    adapters:                       
      - Csv
    var: data                       # Set file content result to "data" variable
    
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
 * @end
 */
export class Csv implements IFileAdapter {
  constructor(private file: IFileAdapter) { }

  async read() {
    const cnt = await this.file.read()
    const { default: parse } = await LazyImport(import('csv-parse/lib/sync'))
    const obj = parse(cnt.toString())
    return obj
  }

  async write(data: any) {
    const { default: stringify } = await LazyImport(import('csv-stringify/lib/sync'))
    const rs = stringify(data)
    return this.file.write(rs)
  }

}