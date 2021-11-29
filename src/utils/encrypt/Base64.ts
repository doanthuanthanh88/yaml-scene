import { Encrypt } from "./Encrypt";

export class Base64 implements Encrypt {
  private static _INSTANCE: Base64

  static GetInstance() {
    if (!this._INSTANCE) {
      return this._INSTANCE = new Base64()
    }
    return this._INSTANCE
  }

  encrypt(data: any) {
    return Buffer.from(data).toString('base64')
  }
  decrypt(data: any) {
    return Buffer.from(data.toString(), 'base64').toString()
  }

}