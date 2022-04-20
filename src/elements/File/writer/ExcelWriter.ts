
import { LazyImport } from "@app/utils/LazyImport";
import { FileWriter } from "./FileWriter";
import { IFileWriter } from "./IFileWriter";

/*****
@name Excel 
@description Write an excel file. Used in File/Writer
@group File/Writer.Adapter
@example
- File/Writer:                      
    path: assets/data1.xlsx
    adapters:                       
      - Excel                       # Write data to excel format
    content: [{
      foo: 'bar',
      qux: 'moo',
      poo: null,
      age: 1
    }, 
    {
      foo: 'bar1',
      qux: 'moo2',
      poo: 444,
      age: 2
    }]
*/
export class ExcelWriter implements IFileWriter {

  constructor(private file: IFileWriter) {
    if (this.file instanceof FileWriter) {
      this.file.config.encoding = 'binary'
    }
  }

  async write(data: any) {
    const { default: json2xls } = await LazyImport(import('json2xls'))
    const xls = json2xls(data);
    await this.file.write(xls)
  }

}