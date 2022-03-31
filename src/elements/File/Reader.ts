import { TraceError } from '@app/utils/error/TraceError';
import chalk from 'chalk';
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';
import { File } from './adapter/File';
import { FileAdapterFactory } from './adapter/FileAdapterFactory';
import { IFileAdapter } from './adapter/IFileAdapter';

/**
 * @guide
 * @name File/Reader
 * @description Read a file then set content to a variable

File adapters:

- [Read a text file](#File%2C%20%2BFile.Adapter%2FText)
- [Read a csv file](#File%2C%20%2BFile.Adapter%2FCsv)
- [Read a json file](#File%2C%20%2BFile.Adapter%2FJson)
- [Read a xml file](#File%2C%20%2BFile.Adapter%2FXml)
- [Read a yaml file](#File%2C%20%2BFile.Adapter%2FYaml)
- [Read a excel file](#File%2C%20%2BFile.Adapter%2FExcel)
- [Read a encrypted file](#File%2C%20%2BFile.Adapter%2FPassword)
 * @group File, Input
 * @exampleType custom
 * @example
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
  - File/Reader:
      title: Read a file with custom adapter
      path: assets/data2.custom_adapter.json
      adapters:
        - Password: MyPassword                # Combine to other adapters
        - YOUR_ADAPTER_PACKAGE/CustomJson:    # Use your adapter with adapter input config
            name: a
            config: b
      var: data
  ```
 * @end
 */
export default class Reader implements IElement {
  proxy: ElementProxy<Reader>

  title: string
  var: string
  path: string
  adapters: (string | object)[]

  private _adapter: IFileAdapter
  private _adapterClasses: {
    AdapterClass: any,
    args?: any
  }[]

  init(props: any) {
    merge(this, props)
    if (!this.adapters) this.adapters = []
    if (!Array.isArray(this.adapters)) this.adapters = [this.adapters]
    if (!this.adapters.length) this.adapters.push('Text')
  }

  prepare() {
    this.path = this.proxy.resolvePath(this.path)
    this._adapterClasses = this.adapters.map(adapter => {
      const adapterName = typeof adapter === 'string' ? adapter : Object.keys(adapter)[0]
      if (!adapterName) throw new TraceError('"adapters" is not valid', { adapter })
      return {
        AdapterClass: FileAdapterFactory.GetAdapter(adapterName),
        args: adapter[adapterName]
      }
    })
  }

  async exec() {
    if (this.title) this.proxy.logger.info('%s', this.title)
    console.group()

    this._adapterClasses.forEach(({ AdapterClass, args }) => {
      this._adapter = new AdapterClass(this._adapter || new File(this.path), args)
    })

    const obj = await this._adapter.read()

    if (this.var) await this.proxy.setVar(this.var, { _: obj }, '_')
    this.proxy.logger.debug('%s %s', chalk.magenta('- Read file at'), chalk.gray(this.path))
    console.groupEnd()
    return obj
  }

}