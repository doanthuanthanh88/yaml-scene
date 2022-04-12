import { IFileAdapter } from "./IFileAdapter";

/*****
@name Text 
@description Read and write text file. Used in File/Writer, File/Reader
@group File.Adapter
@example
- File/Reader:
    title: Read a text file
    path: assets/data1.txt
    adapters:                       # Not set, it use `Text` to default adapter
      - Text
    var: data                       # Set file content result to "data" variable
    
- File/Writer:
    title: Write to text file
    path: assets/data2.txt
    adapters:                       # Not set, it use `Text` to default adapter
      - Text 
    content: |
      Hello world
*/
export class Text implements IFileAdapter {
  constructor(private file: IFileAdapter) { }

  async read() {
    const cnt = await this.file.read()
    return cnt.toString()
  }

  write(data: any) {
    return this.file.write(data.toString())
  }

}