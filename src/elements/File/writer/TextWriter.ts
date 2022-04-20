import { IFileWriter } from "./IFileWriter";

/*****
@name Text 
@description Write a text file. Used in File/Writer
@group File/Writer.Adapter
@example
- File/Writer:
    title: Write to text file
    path: assets/data2.txt
    adapters:                       # Not set, it use `Text` to default adapter
      - Text 
    content: |
      Hello world
*/
export class TextWriter implements IFileWriter {
  constructor(private file: IFileWriter) { }

  async write(data: any) {
    await this.file.write(data.toString())
  }

}