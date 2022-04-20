import { IFileReader } from "./IFileReader"

/*****
@name Json 
@description Read a json file. Used in File/Reader
@group File/Reader.Adapter
@example
- File/Reader:
    title: Read a json file
    path: assets/data1.json
    adapters:                       
      - Json
    var: data                       # Set file content result to "data" variable
*/
export class JsonReader implements IFileReader {
  constructor(private file: IFileReader) { }

  async read() {
    const cnt = await this.file.read()
    const obj = JSON.parse(cnt.toString())
    return obj
  }

}
