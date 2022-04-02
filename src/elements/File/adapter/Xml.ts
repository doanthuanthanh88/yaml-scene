import { Builder, parseStringPromise } from 'xml2js';
import { IFileAdapter } from "./IFileAdapter";

/**
 * @guide
 * @name Xml 
 * @description Read and write xml file. Used in File/Writer, File/Reader
 * @group File, +File.Adapter
 * @example
- File/Reader:
    title: Read a xml file
    path: assets/data1.xml
    adapters:                       
      - Xml
    var: data                       # Set file content result to "data" variable
    
- File/Writer:
    title: Write to xml file
    path: assets/data2.xml
    adapters:                       
      - Xml 
    content: 
      name: name 1
      age: 1
      class: 01
 * @end
 */
export class Xml implements IFileAdapter {
  constructor(private file: IFileAdapter) { }

  async read() {
    const cnt = await this.file.read()
    const obj = await parseStringPromise(cnt.toString())
    return obj
  }

  async write(data: any) {
    const rs = await new Builder().buildObject(data)
    return this.file.write(rs)
  }

}