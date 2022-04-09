
import { LazyImport } from "@app/utils/LazyImport";
import { File } from "./File";
import { IFileAdapter } from "./IFileAdapter";

/**
 * @guide
 * @name Excel 
 * @description Read and write excel file. Used in File/Writer, File/Reader
 * @group File, File.Adapter
 * @example
- File/Reader:
    title: Read text file 1 with password
    path: assets/data1.xlsx
    adapters:
      - Excel: MyPassword           # Decrypt content with password is "MyPassword"
          sheets:                   # Read data only these sheets
            - name: Sheet 1         # Sheet name
              range: 'A1:C9'        # Only take cell in the region
              header:             
                rows: 1             # Skip, dont take data in these rows
              columnToKey:          # Mapping column key (A,B,C) to name
                A: foo name
                B: qux label
                C: poo title
    var: data                       # Set file data result to "data" variable
    
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
 * @end
 */
export class Excel implements IFileAdapter {
  public config: {
    sheets: {
      header?: { rows: number } | undefined;
      range?: string | undefined;
      columnToKey?: { [key: string]: string } | undefined;
      includeEmptyLines?: boolean | undefined;
      sheetStubs?: boolean | undefined;
      name: string
    }[]
  }

  constructor(private file: IFileAdapter, config = {} as any) {
    this.config = config
    if (this.file instanceof File) {
      this.file.config.encoding = 'binary'
    }
  }

  async read() {
    const { default: excelToJson } = await LazyImport(import('convert-excel-to-json'))
    const data = excelToJson({
      source: await this.file.read(),
      ...this.config
    })
    return data
  }

  async write(data: any) {
    const { default: json2xls } = await LazyImport(import('json2xls'))
    const xls = json2xls(data);
    return this.file.write(xls)
  }

}