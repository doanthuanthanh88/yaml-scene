import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { Encrypt } from "./Encrypt";

export class AES implements Encrypt {
  salt: Buffer
  constructor(salt: string) {
    this.salt = Buffer.from(salt)
  }

  encrypt(text: string) {
    const hash = createHash("sha1")
    hash.update(this.salt);
    const key = hash.digest().slice(0, 16);
    const iv = randomBytes(16)
    const cipher = createCipheriv('aes-128-cbc', key, iv)
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
  }

  decrypt(text: string) {
    const hash = createHash("sha1")
    hash.update(this.salt);
    const key = hash.digest().slice(0, 16);
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = Buffer.from(textParts.join(':'), 'hex')
    const decipher = createDecipheriv('aes-128-cbc', key, iv)
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()])
    return decrypted.toString()
  }

}