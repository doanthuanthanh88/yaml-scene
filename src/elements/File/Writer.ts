import { TraceError } from '@app/utils/error/TraceError';
import chalk from 'chalk';
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';
import { FileWriter } from './writer/FileWriter';
import { FileWriterFactory } from './writer/FileWriterFactory';
import { IFileWriter } from './writer/IFileWriter';

/*****
@name File/Writer
@description Write content to a file
File adapters:

- [Read a text file](#user-content-file%2fwriter.adapter-text)
- [Read a csv file](#user-content-file%2fwriter.adapter-csv)
- [Read a json file](#user-content-file%2fwriter.adapter-json)
- [Read a xml file](#user-content-file%2fwriter.adapter-xml)
- [Read a yaml file](#user-content-file%2fwriter.adapter-yaml)
- [Read a excel file](#user-content-file%2fwriter.adapter-excel)
- [Read a encrypted file](#user-content-file%2fwriter.adapter-password)
@group File, Output
@exampleType custom
@example
```yaml
- File/Writer:
    title: Write to a json file
    path: assets/data1.json
    adapters:
      - Json
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3
```

### Notes:
You can write a new adapter by yourself then use in adapters.  

**Write a custom adapter**

1. Create a your writer adapter in `CustomJsonWriter.ts`
  ```typescript
  import { IFileWriter } from "yaml-scene/utils/adapter/file/IFileWriter"

  export class CustomJsonWriter implements IFileWriter {
    constructor(private file: IFileWriter, public adapterConfig: { name: string, config: any }) { }

    async write(data: any) {
      // Custom here
      const rs = await JSON.stringify(data)
      
      await this.file.write(rs)
    }
  }

  ```
2. Publish your adapter package to npm registry...

**How to used a custom adapter**

1. Install your adapter package
  - Install global
    ```sh
    yarn add global `YOUR_ADAPTER_PACKAGE`
    // OR
    npm install -g `YOUR_ADAPTER_PACKAGE`
    ```
  - Use package in your local need create a scene file then declare your extension
  ```sh
    extensions:
      YOUR_ADAPTER_PACKAGE: Path to local package
    steps:
      ...
  ```
  
2. Create your scenario file then use it
  ```yaml
  - File/Writer:
      title: Write custom json file
      path: assets/data1.json
      adapters:
        - YOUR_ADAPTER_PACKAGE/CustomJsonWriter:    # Use your adapter with adapter input config
            name: a
            config: b
        - Password: MyPassword                      # Combine to other adapters            
      content:
        - name: name 1
          age: 1
        - name: name 2
          age: 3
  ```
*/
export default class Writer implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  title?: string
  content: string
  path: string

  adapters: (string | any)[]

  private async getAdapter() {
    let _adapter: IFileWriter
    for (const adapter of this.adapters.reverse()) {
      const adapterName = typeof adapter === 'string' ? adapter : Object.keys(adapter)[0]
      if (!adapterName) throw new TraceError('"adapters" is not valid', { adapter })
      const AdapterClass = await FileWriterFactory.GetWriter(adapterName)
      const args = typeof adapter === 'object' ? adapter[adapterName] : undefined
      if (!_adapter) {
        if (!AdapterClass['Initable']) {
          _adapter = new FileWriter(this.path)
        }
      }
      _adapter = new AdapterClass(_adapter || this.path, args)
    }
    return _adapter
  }

  constructor() {
    this.adapters = []
  }

  init(props: any) {
    merge(this, props)

  }

  async prepare() {
    await this.proxy.applyVars(this, 'title', 'content', 'path', 'adapters')

    if (!Array.isArray(this.adapters)) this.adapters = [this.adapters]
    if (!this.adapters.length) this.adapters.push('Text')

    if (!this.content) throw new TraceError('"content" is required')
    this.path = this.proxy.resolvePath(this.path)
  }

  async exec() {
    if (this.title) this.proxy.logger.info('%s', this.title)
    this.title && console.group()
    try {
      const adapters = await this.getAdapter()
      await adapters.write(this.content)
      this.proxy.logger.debug('%s %s', chalk.magenta('- Write file to'), chalk.gray(this.path))
    } finally {
      this.title && console.groupEnd()
    }
  }

}