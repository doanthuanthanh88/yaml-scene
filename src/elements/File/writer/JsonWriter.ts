import { IFileWriter } from "./IFileWriter"

/*****
@name Json 
@description Write a json file. Used in File/Writer
@group File/Writer.Adapter
@example
- File/Writer:
    title: Write to json file
    path: assets/data2.json
    adapters:                       
      - Json 
    content: 
      - name: name 1
        age: 1
      - name: name 2
        age: 3
*/
export class JsonWriter implements IFileWriter {
  constructor(private file: IFileWriter, public config = { pretty: false }) { }

  async write(data: any) {
    const rs = this.config.pretty ? JSON.stringify(data, null, '  ') : JSON.stringify(data)
    await this.file.write(rs)
  }
}
