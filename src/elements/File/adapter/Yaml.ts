import { IFileAdapter } from "./IFileAdapter";
import { dump, load } from "js-yaml";

/**
 * @guide
 * @name Yaml 
 * @description Read and write yaml file. Used in File/Writer, File/Reader
 * @group File, +File.Adapter
 * @example
- File/Reader:
    title: Read a yaml file
    path: assets/data1.yaml
    adapters:                       
      - Yaml
    var: data                       # Set file content result to "data" variable
    
- File/Writer:
    title: Write to yaml file
    path: assets/data2.yaml
    adapters:                       
      - Yaml 
    content: 
      - name: name 1
        age: 1
      - name: name 2
        age: 3
 * @end
 */
export class Yaml implements IFileAdapter {
  constructor(private file: IFileAdapter) { }

  async read() {
    const cnt = await this.file.read()
    const obj = await load(cnt.toString())
    return obj
  }

  async write(data: any) {
    const rs = await dump(data)
    await this.file.write(rs)
  }

}