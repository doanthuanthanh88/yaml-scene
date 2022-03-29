import { AES } from '@app/utils/encrypt/AES';
import { TraceError } from '@app/utils/error/TraceError';
import { IFileAdapter } from "./IFileAdapter";

export class Password implements IFileAdapter {
  private aes: AES

  constructor(private file: IFileAdapter, password) {
    if (!password) throw new TraceError('Password is required')
    this.aes = new AES(password)
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