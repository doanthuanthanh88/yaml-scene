import { AES } from '@app/utils/encrypt/AES';
import { TraceError } from '@app/utils/error/TraceError';
import { IFileReader } from "./IFileReader";

/*****
@name Password 
@description Read a encrypted file (`aes-128-cbc`). Used in File/Reader
@group File/Reader.Adapter
@example
- File/Reader:
    title: Read a json file
    path: assets/data1
    adapters:                       
      - Password: My Password       # The first: Decrypt file data with password
      - Json                        # The second: Parse data to json before return result
    var: data                       # Set file content result to "data" variable
*/
export class PasswordReader implements IFileReader {
  private aes: AES

  constructor(private file: IFileReader, password?: string) {
    if (!password) throw new TraceError('Password is required in "IFileReader/Password"', { password })
    this.aes = new AES(password)
  }

  async read() {
    const buf = await this.file.read()
    if (!this.aes) return buf

    const data = await this.aes.decrypt(buf.toString())
    return data
  }

}