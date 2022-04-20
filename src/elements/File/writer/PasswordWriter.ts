import { AES } from '@app/utils/encrypt/AES';
import { TraceError } from '@app/utils/error/TraceError';
import { IFileWriter } from "./IFileWriter";

/*****
@name Password 
@description Write a encrypted file (`aes-128-cbc`). Used in File/Writer
@group File/Writer.Adapter
@example
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
*/
export class PasswordWriter implements IFileWriter {
  private aes: AES

  constructor(private file: IFileWriter, password?: string) {
    if (!password) throw new TraceError('Password is required in "IFileWriter/Password"', { password })
    this.aes = new AES(password)
  }

  async write(data: any) {
    const encryptedData = await this.aes.encrypt(data)
    await this.file.write(encryptedData)
  }

}