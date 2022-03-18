import { FileDataSourceFactory } from '@app/utils/data-source/file/FileDataSourceFactory';
import { FileType } from '@app/utils/data-source/file/FileType';
import { AES } from '@app/utils/encrypt/AES';
import { Encrypt } from '@app/utils/encrypt/Encrypt';
import chalk from 'chalk';
import merge from "lodash.merge";
import { extname } from 'path';
import { ElementProxy } from '../ElementProxy';

/**
 * @guide
 * @name WriteFile
 * @description Write content to a file  
It uses `aes-128-cbc` to encrypt content with a password.  
Refer to [ReadFile](.) to decrypt content
 * @group File, Output
 * @example
### Text file
- WriteFile:
    title: Write text file with password
    encrypt:
      password: thanh123
    path: assets/data1.txt
    content: |
      Hello world

- WriteFile:
    title: Write text file without password
    path: assets/data2.txt
    content: |
      Hello world

### CSV File

- WriteFile/CSV:
    title: Write csv file 1 with password
    path: assets/data1.csv
    encrypt:
      password: thanh123
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile/CSV:
    title: Write csv file 2 without password
    path: assets/data2.csv
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]

### JSON File

- WriteFile/JSON:
    title: Write json file 1 with password
    encrypt:
      password: thanh123
    path: assets/data1.json
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile/JSON:
    title: Write json file 2 without password
    path: assets/data2.json
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]

### XML File

- WriteFile/XML:
    title: Write xml file 1 with password
    encrypt:
      password: thanh123
    path: assets/data1.xml
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile/XML:
    title: Write xml file 2 without password
    path: assets/data2.xml
    content:
      name: name 1
      age: 1
      class: 01

### YAML File

- WriteFile/YAML:
    title: Write yaml file 1 with password
    encrypt:
      password: thanh123
    path: assets/data1.yaml
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile/YAML:
    title: Write yaml file 2 without password
    path: assets/data2.yaml
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]
 * @end
 */
export default class WriteFile {
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
      this.type = extname(this.path).replace(/\./g, '').toLowerCase() as FileType
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