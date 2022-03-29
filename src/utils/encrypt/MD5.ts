import { createHash } from 'crypto';
import { TraceError } from '../error/TraceError';
import { Encrypt } from "./Encrypt";

export class MD5 implements Encrypt {
  private static _Instance: MD5

  static get Instance() {
    return this._Instance || (this._Instance = new MD5())
  }

  encrypt(data: any) {
    return createHash('md5').update(data).digest('hex')
  }

  decrypt(_data: any) {
    throw new TraceError('Could not decode md5')
  }

}