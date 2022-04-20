import { TraceError } from '@app/utils/error/TraceError';
import chalk from 'chalk';
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';
import { FileReaderFactory } from './reader/FileReaderFactory';
import { IFileReader } from './reader/IFileReader';
import { ResourceReader } from './reader/ResourceReader';

/*****
@name File/Reader
@description Read a file then set content to a variable

File adapters:

- [Read a text file](#user-content-file%2freader.adapter-text)
- [Read a csv file](#user-content-file%2freader.adapter-csv)
- [Read a json file](#user-content-file%2freader.adapter-json)
- [Read a xml file](#user-content-file%2freader.adapter-xml)
- [Read a yaml file](#user-content-file%2freader.adapter-yaml)
- [Read a excel file](#user-content-file%2freader.adapter-excel)
- [Read a encrypted file](#user-content-file%2freader.adapter-password)
@group File, Input
@exampleType custom
@example
```yaml
- File/Reader:
    title: Read a json file
    path: assets/data1.json         # File content is { field1: value1 }
    adapters:
      - Json
    var: data                       # Set file content result to "data" variable
    var:
      myVar: ${_.field1}            # Extract `field1` in file content to `myVar`.
                                    # - `_` is file content data after is parsed
```

### Notes:
You can write a new adapter by yourself then use in adapters.  

**Write a custom adapter**

1. Create a your reader adapter in `CustomJsonReader.ts`
  ```typescript
  import { IFileReader } from "yaml-scene/utils/adapter/file/writer"

  export class CustomJsonReader implements IFileReader {
    constructor(private file: IFileReader, public adapterConfig: { name: string, config: any }) { }

    async read() {
      const cnt = await this.file.read()

      // Custom here
      const obj = await JSON.parse(cnt.toString())
      return obj
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
  - File/Reader:
      title: Read a file with custom adapter
      path: assets/data2.custom_adapter.json
      adapters:
        - Password: MyPassword                      # Combine to other adapters
        - YOUR_ADAPTER_PACKAGE/CustomJsonReader:    # Use your adapter with adapter input config
            name: a
            config: b
      var: data
  ```
*/
export default class Reader implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  title?: string
  var: string
  path: string
  adapters: (string | any)[]

  private async getAdapter() {
    let _adapter: IFileReader
    for (const adapter of this.adapters) {
      const adapterName = typeof adapter === 'string' ? adapter : Object.keys(adapter)[0]
      if (!adapterName) throw new TraceError('"adapters" is not valid', { adapter })
      const AdapterClass = await FileReaderFactory.GetReader(adapterName)
      const args = typeof adapter === 'object' ? adapter[adapterName] : undefined
      if (!_adapter) {
        if (!AdapterClass['Initable']) {
          _adapter = new ResourceReader(this.path)
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
    await this.proxy.applyVars(this, 'title', 'path', 'adapters')

    if (!Array.isArray(this.adapters)) this.adapters = [this.adapters]
    if (!this.adapters.length) this.adapters.push('Text')

    this.path = this.proxy.resolvePath(this.path)
  }

  async exec() {
    if (this.title) this.proxy.logger.info('%s', this.title)
    this.title && console.group()
    try {
      const adapters = await this.getAdapter()
      const obj = await adapters.read()
      if (this.var) await this.proxy.setVar(this.var, { _: obj }, '_')
      this.proxy.logger.debug('%s %s', chalk.magenta('- Read file at'), chalk.gray(this.path))
      return obj
    } finally {
      this.title && console.groupEnd()
    }
  }

}