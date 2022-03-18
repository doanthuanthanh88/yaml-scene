import { FileDataSourceFactory } from '@app/utils/data-source/file/FileDataSourceFactory';
import { FileType } from '@app/utils/data-source/file/FileType';
import { AES } from '@app/utils/encrypt/AES';
import { Encrypt } from '@app/utils/encrypt/Encrypt';
import chalk from 'chalk';
import { merge } from 'lodash';
import { extname } from 'path';
import { ElementProxy } from '../ElementProxy';

/**
 * ReadFile
 * @description Read a file then set content to a variable  
 * It uses `aes-128-cbc` to decrypt content with a password.  
 * Refer to [WriteFile](.) to encrypt content
 * @group File, Input
 * @example
### Text file
- ReadFile:
    title: Read text file 1 with password
    path: assets/data1.txt
    decrypt:
      password: thanh123
    var: data

- ReadFile:
    title: Read text file 2 without password
    path: assets/data2.txt
    var: data

### CSV File

- ReadFile~CSV:
    title: Read csv file 1 with password
    decrypt:
      password: thanh123
    path: assets/data1.csv
    var: data

- ReadFile~CSV:
    title: Read csv file 2 without password
    path: assets/data2.csv
    var: data

### JSON File

- ReadFile~JSON:
    title: Read json file 1 with password
    path: assets/data1.json
    decrypt:
      password: thanh123
    var: data

- ReadFile~JSON:
    title: Read json file 2 without password
    path: assets/data2.json
    var: data

### XML file

- ReadFile~XML:
    title: Read xml file 1 with password
    path: assets/data1.xml
    decrypt:
      password: thanh123
    var: data

- ReadFile~XML:
    title: Read xml file 2 without password
    path: assets/data2.xml
    var: data

### YAML file

- ReadFile~YAML:
    title: Read yaml file 1 with password
    path: assets/data1.yaml
    decrypt:
      password: thanh123
    var: data

- ReadFile~YAML:
    title: Read yaml file 2 without password
    path: assets/data2.yaml
    var: data

 */
export class ReadFile {
  proxy: ElementProxy<ReadFile>

  title: string
  var: string
  path: string
  type: FileType
  decrypt: {
    password: string
  }

  init(props: any) {
    merge(this, props)
    if (!this.type) {
      this.type = extname(this.path).replace(/\./g, '').toLowerCase() as FileType
    }
  }

  async exec() {
    if (this.title) this.proxy.logger.info('%s', this.title)
    console.group()
    let decrypt: Encrypt
    if (this.decrypt?.password) {
      decrypt = new AES(this.decrypt.password.toString())
    }
    const file = FileDataSourceFactory.GetDataSource(this.type, this.proxy.resolvePath(this.path), decrypt)
    const obj = await file.read()
    if (this.var) this.proxy.setVar(this.var, obj)
    this.proxy.logger.debug('%s %s', chalk.magenta('- Read file at'), chalk.gray(this.path))
    console.groupEnd()
    return obj
  }

}