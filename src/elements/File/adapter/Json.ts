import { IFileAdapter } from "./IFileAdapter"

/*****
@name Json 
@description Read and write json file. Used in File/Writer, File/Reader
@group File, File.Adapter
@example
- File/Reader:
    title: Read a json file
    path: assets/data1.json
    adapters:                       
      - Json
    var: data                       # Set file content result to "data" variable
    
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
export class Json implements IFileAdapter {
  constructor(private file: IFileAdapter, public config = { pretty: false }) { }

  async read() {
    const cnt = await this.file.read()
    const obj = JSON.parse(cnt.toString())
    return obj
  }

  async write(data: any) {
    const rs = this.config.pretty ? JSON.stringify(data, null, '  ') : JSON.stringify(data)
    return this.file.write(rs)
  }
}
