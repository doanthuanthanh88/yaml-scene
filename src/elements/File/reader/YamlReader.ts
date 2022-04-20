import { load } from "js-yaml";
import { IFileReader } from "./IFileReader";

/*****
@name Yaml 
@description Read a yaml file. Used in File/Reader
@group File/Reader.Adapter
@example
- File/Reader:
    title: Read a yaml file
    path: assets/data1.yaml
    adapters:                       
      - Yaml
    var: data                       # Set file content result to "data" variable
*/
export class YamlReader implements IFileReader {
  constructor(private file: IFileReader) { }

  async read() {
    const cnt = await this.file.read()
    const obj = await load(cnt.toString())
    return obj
  }

}