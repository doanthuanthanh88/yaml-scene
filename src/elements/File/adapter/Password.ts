import { AES } from '@app/utils/encrypt/AES';
import { IFileAdapter } from "./IFileAdapter";

/**
 * @guide
 * @name Password 
 * @description Read and write a encrypted file (`aes-128-cbc`). Used in File/Writer, File/Reader
 * @group File, +File.Adapter
 * @example
- File/Reader:
    title: Read a json file
    path: assets/data1
    adapters:                       
      - Password: My Password       # The first: Decrypt file data with password
      - Json                        # The second: Parse data to json before return result
    var: data                       # Set file content result to "data" variable
    
- File/Writer:
    title: Write to json file
    path: assets/data2
    adapters:
      - Json                        # The first: Convert to json format
      - Password: My Password       # The second: Encrypt file content with password before save to file
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3
 * @end
 */
export class Password implements IFileAdapter {
  private aes?: AES

  constructor(private file: IFileAdapter, password?: string) {
    if (password) this.aes = new AES(password)
  }

  async read() {
    const buf = await this.file.read()
    if (!this.aes) return buf

    const data = await this.aes.decrypt(buf.toString())
    return data
  }

  async write(data: any) {
    if (this.aes) {
      data = await this.aes.encrypt(data)
    }
    return this.file.write(data)
  }

}