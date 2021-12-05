import { FileDataSourceFactory } from '@app/utils/data-source/file/FileDataSourceFactory';
import { FileType } from '@app/utils/data-source/file/FileType';
import { AES } from '@app/utils/encrypt/AES';
import { Encrypt } from '@app/utils/encrypt/Encrypt';
import chalk from 'chalk';
import { merge } from 'lodash';
import { extname } from 'path';
import { ElementProxy } from '../ElementProxy';

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
    if (this.title) this.proxy.logger.info('%s', this.title)
    console.group()
    let encrypt: Encrypt
    if (this.encrypt?.password) {
      encrypt = new AES(this.encrypt.password.toString())
    }
    const file = FileDataSourceFactory.GetDataSource(this.type, this.proxy.resolvePath(this.path), encrypt)
    await file.write(this.content)
    this.proxy.logger.debug('%s %s', chalk.magenta('- Write file to'), chalk.gray(this.path))
    console.groupEnd()
  }

}