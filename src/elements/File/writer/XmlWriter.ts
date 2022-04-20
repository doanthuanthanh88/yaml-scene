import { LazyImport } from '@app/utils/LazyImport';
import { IFileWriter } from "./IFileWriter";

/*****
@name Xml 
@description Write a xml file. Used in File/Writer
@group File/Writer.Adapter
@example
- File/Writer:
    title: Write to xml file
    path: assets/data2.xml
    adapters:                       
      - Xml 
    content: 
      name: name 1
      age: 1
      class: 01
*/
export class XmlWriter implements IFileWriter {
  constructor(private file: IFileWriter) { }

  async write(data: any) {
    const { Builder } = await LazyImport(import('xml2js'))
    const rs = await new Builder().buildObject(data)
    await this.file.write(rs)
  }

}