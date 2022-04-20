
import { LazyImport } from "@app/utils/LazyImport";
import { IFileReader } from "./IFileReader";

/*****
@name Excel 
@description Read an excel file. Used in File/Reader
@group File/Reader.Adapter
@example
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
*/
export class ExcelReader implements IFileReader {
  constructor(private file: IFileReader, public config = {} as {
    sheets: {
      header?: { rows: number } | undefined;
      range?: string | undefined;
      columnToKey?: { [key: string]: string } | undefined;
      includeEmptyLines?: boolean | undefined;
      sheetStubs?: boolean | undefined;
      name: string
    }[]
  }) { }

  async read() {
    const { default: excelToJson } = await LazyImport(import('convert-excel-to-json'))
    const data = excelToJson({
      source: await this.file.read(),
      ...this.config
    })
    return data
  }

}