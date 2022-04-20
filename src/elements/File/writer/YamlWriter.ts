import { dump } from "js-yaml";
import { IFileWriter } from "./IFileWriter";

/*****
@name Yaml 
@description Write a yaml file. Used in File/Writer
@group File/Writer.Adapter
@example
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
*/
export class YamlWriter implements IFileWriter {
  constructor(private file: IFileWriter) { }

  async write(data: any) {
    const rs = await dump(data)
    await this.file.write(rs)
  }

}