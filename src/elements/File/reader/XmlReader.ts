import { LazyImport } from '@app/utils/LazyImport';
import { IFileReader } from "./IFileReader";

/*****
@name Xml 
@description Read a xml file. Used in File/Reader
@group File/Reader.Adapter
@example
- File/Reader:
    title: Read a xml file
    path: assets/data1.xml
    adapters:                       
      - Xml
    var: data                       # Set file content result to "data" variable
*/
export class XmlReader implements IFileReader {
  constructor(private file: IFileReader) { }

  async read() {
    const cnt = await this.file.read()
    const { parseStringPromise } = await LazyImport(import('xml2js'))
    const obj = await parseStringPromise(cnt.toString())
    return obj
  }

}