import { IFileReader } from "./IFileReader";

/*****
@name Text 
@description Read a text file. Used in File/Reader
@group File/Reader.Adapter
@example
- File/Reader:
    title: Read a text file
    path: assets/data1.txt
    adapters:                       # Not set, it use `Text` to default adapter
      - Text
    var: data                       # Set file content result to "data" variable
*/
export class TextReader implements IFileReader {
  constructor(private file: IFileReader) { }

  async read() {
    const cnt = await this.file.read()
    return cnt.toString()
  }

}