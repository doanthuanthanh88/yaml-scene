import { Encrypt } from "@app/utils/encrypt/Encrypt";
import { DataSource } from "../DataSource";

export class EncryptDataSource implements DataSource {
  constructor(private file: DataSource, private encrypt: Encrypt) { }

  async read() {
    const buf = await this.file.read()
    const data = await this.encrypt.decrypt(buf.toString())
    return data
  }

  async write(data: any) {
    const rs = await this.encrypt.encrypt(data)
    await this.file.write(rs)
  }


}