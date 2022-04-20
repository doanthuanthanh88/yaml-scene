import { LazyImport } from "@app/utils/LazyImport";
import { IFileReader } from "./IFileReader";

/*****
@name Csv 
@description Read a csv file. Used in File/Reader
@group File/Reader.Adapter
@example
- File/Reader:
    title: Read a csv file
    path: assets/data1.csv
    adapters:                       
      - Csv
    var: data                       # Set file content result to "data" variable
*/
export class CsvReader implements IFileReader {
  constructor(private file: IFileReader) { }

  async read() {
    const cnt = await this.file.read()
    const { default: parse } = await LazyImport(import('csv-parse/lib/sync'))
    const obj = parse(cnt.toString())
    return obj
  }

} 