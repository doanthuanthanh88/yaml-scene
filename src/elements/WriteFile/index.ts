import { TestCase } from '@app/TestCase';
import { AES } from '@app/utils/encrypt/AES';
import { Encrypt } from '@app/utils/encrypt/Encrypt';
import { FileType } from '@app/utils/data-source/file/FileType';
import { merge } from 'lodash';
import { extname } from 'path';
import { ElementProxy } from '../ElementProxy';
import { FileDataSourceFactory } from '@app/utils/data-source/file/FileDataSourceFactory';

export class WriteFile {
  proxy: ElementProxy<WriteFile>

  title: string
  content: string
  path: string
  type: FileType
  encrypt: {
    password: string
  }

  init(props: any) {
    merge(this, props)
    if (!this.content) throw new Error('"content" is required')
    if (!this.type) {
      this.type = extname(this.path).substr(1).toLowerCase() as FileType
    }
  }

  prepare() {
    this.title = this.proxy.getVar(this.title)
    this.content = this.proxy.getVar(this.content)
  }

  async exec() {
    if (this.title) console.log(this.title, this.path)
    let encrypt: Encrypt
    if (this.encrypt?.password) {
      encrypt = new AES(this.encrypt.password.toString())
    }
    const file = FileDataSourceFactory.GetDataSource(this.type, TestCase.GetPathFromRoot(this.path), encrypt)
    await file.write(this.content)
  }

}