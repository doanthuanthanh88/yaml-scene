import { Encrypt } from "../../encrypt/Encrypt"
import { DataSource } from "../DataSource"
import { CsvDataSource } from "./CsvDataSource"
import { EncryptDataSource } from "./EncryptDataSource"
import { FileDataSource } from "./FileDataSource"
import { FileType } from "./FileType"
import { JsonDataSource } from "./JsonDataSource"
import { TextDataSource } from "./TextDataSource"
import { XmlDataSource } from "./XmlDataSource"
import { YamlDataSource } from "./YamlDataSource"

export class FileDataSourceFactory {
  static GetDataSource(type: FileType, path: string, encrypt: Encrypt) {
    let deco: DataSource = new FileDataSource(path)
    if (encrypt) {
      deco = new EncryptDataSource(deco, encrypt)
    }
    switch (type) {
      case FileType.JSON:
        return new JsonDataSource(deco)
      case FileType.CSV:
        return new CsvDataSource(deco)
      case FileType.YAML:
        return new YamlDataSource(deco)
      case FileType.XML:
        return new XmlDataSource(deco)
      default:
        return new TextDataSource(deco)
    }
  }
}