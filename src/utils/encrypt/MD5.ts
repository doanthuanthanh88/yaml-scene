import { createHash } from 'crypto';
import { Encrypt } from "./Encrypt";

export class MD5 implements Encrypt {
  private static _INSTANCE: MD5

  static GetInstance() {
    if (!this._INSTANCE) {
      return this._INSTANCE = new MD5()
    }
    return this._INSTANCE
  }

  encrypt(data: any) {
    return createHash('md5').update(data).digest('hex')
  }

  decrypt(_data: any) {
    throw new Error('Could not decode md5')
  }

}