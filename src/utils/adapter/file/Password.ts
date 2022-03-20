import { AES as AESEncrypt } from '@app/utils/encrypt/AES';
import { IFileAdapter } from "./IFileAdapter";

export class Password implements IFileAdapter {
  private aes: AESEncrypt

  constructor(private file: IFileAdapter, password) {
    if (!password) throw new Error('Password is required')
    this.aes = new AESEncrypt(password)
  }

  async read() {
    const buf = await this.file.read()
    const data = await this.aes.decrypt(buf.toString())
    return data
  }

  async write(data: any) {
    const rs = await this.aes.encrypt(data)
    await this.file.write(rs)
  }

}