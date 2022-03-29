import { Encrypt } from "./Encrypt";

export class Base64 implements Encrypt {
  private static _Instance: Base64

  static get Instance() {
    return this._Instance || (this._Instance = new Base64())
  }

  encrypt(data: any) {
    return Buffer.from(data).toString('base64')
  }
  decrypt(data: any) {
    return Buffer.from(data.toString(), 'base64').toString()
  }

}