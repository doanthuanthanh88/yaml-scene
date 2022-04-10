import { TraceError } from '@app/utils/error/TraceError';
import chalk from 'chalk';
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';
import { File } from './adapter/File';
import { FileAdapterFactory } from './adapter/FileAdapterFactory';
import { IFileAdapter } from './adapter/IFileAdapter';

/*****
@name File/Writer
@description Write content to a file
File adapters:

- [Read a text file](#user-content-file%2c%20file.adapter-text)
- [Read a csv file](#user-content-file%2c%20file.adapter-csv)
- [Read a json file](#user-content-file%2c%20file.adapter-json)
- [Read a xml file](#user-content-file%2c%20file.adapter-xml)
- [Read a yaml file](#user-content-file%2c%20file.adapter-yaml)
- [Read a excel file](#user-content-file%2c%20file.adapter-excel)
- [Read a encrypted file](#user-content-file%2c%20file.adapter-password)
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

1. Create your adapter in `CustomJson.ts`
  ```typescript
  import { IFileAdapter } from "yaml-scene/utils/adapter/file/IFileAdapter"

  export class CustomJson implements IFileAdapter {
    constructor(private file: IFileAdapter, public adapterConfig: { name: string, config: any }) { }

    async read() {
      const cnt = await this.file.read()

      // Custom here
      const obj = await JSON.parse(cnt.toString())
      return obj
    }

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
        - YOUR_ADAPTER_PACKAGE/CustomJson:    # Use your adapter with adapter input config
            name: a
            config: b
        - Password: MyPassword                # Combine to other adapters            
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

  private get _adapter() {
    let _adapter: IFileAdapter
    for (const adapter of this.adapters.reverse()) {
      const adapterName = typeof adapter === 'string' ? adapter : Object.keys(adapter)[0]
      if (!adapterName) throw new TraceError('"adapters" is not valid', { adapter })

      const AdapterClass = FileAdapterFactory.GetAdapter(adapterName)
      const args = typeof adapter === 'object' ? adapter[adapterName] : undefined
      if (!_adapter) {
        if (!['Resource', 'Url', 'File'].includes(adapterName)) {
          _adapter = new File(this.path)
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
      await this._adapter.write(this.content)
      this.proxy.logger.debug('%s %s', chalk.magenta('- Write file to'), chalk.gray(this.path))
    } finally {
      this.title && console.groupEnd()
    }
  }

}