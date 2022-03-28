import chalk from 'chalk';
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';
import { File } from './adapter/File';
import { FileAdapterFactory } from './adapter/FileAdapterFactory';
import { IFileAdapter } from './adapter/IFileAdapter';

/**
 * @guide
 * @name File/Writer
 * @description Write content to a file  
It uses `aes-128-cbc` to encrypt content with a password.  
Refer to [File/Reader](.) to decrypt content
 * @group File, Output
 * @exampleType custom
 * @example
### Text file

```yaml
- File/Writer:
    title: Write text file with password
    path: assets/data1.txt
    adapters:
      - Password: MyPassword        # Encrypt content before save to file
    content: |
      Hello world

- File/Writer:
    title: Write text file without password
    path: assets/data2.txt
    content: |
      Hello world
```

### CSV File

```yaml
- File/Writer:
    title: Write csv file 1 with password
    path: assets/data1.csv
    adapters:
      - Csv                         # The first convert data type is Csv to string
      - Password: MyPassword        # The seconds encrypt content before save to file
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- File/Writer:
    title: Write csv file 2 without password
    path: assets/data2.csv
    adapters:
      - Csv                         # Convert data type is Csv to string before save to file
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]
```

### JSON File

```yaml
- File/Writer:
    title: Write json file 1 with password
    path: assets/data1.json
    adapters:
      - Json                        # The first convert data type is Json to string
      - Password: MyPassword        # The seconds encrypt content before save to file
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- File/Writer:
    title: Write json file 2 without password
    path: assets/data2.json
    adapters:
      - Json:                         # Convert data type is Json to string before save to file
          pretty: true                # Pretty format before write to file
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]
```

### XML File

```yaml
- File/Writer:
    title: Write xml file 1 with password
    path: assets/data1.xml
    adapters:
      - Xml                         # The first convert data type is Xml to string
      - Password: MyPassword        # The seconds encrypt content before save to file
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- File/Writer:
    title: Write xml file 2 without password
    path: assets/data2.xml
    adapters:
      - Xml                         # Convert data type is Xml to string before save to file
    content:
      name: name 1
      age: 1
      class: 01
```

### YAML File

```yaml
- File/Writer:
    title: Write yaml file 1 with password
    path: assets/data1.yaml
    adapters:
      - Yaml                        # The first convert data type is Yaml to string
      - Password: MyPassword        # The seconds encrypt content before save to file
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- File/Writer:
    title: Write yaml file 2 without password
    path: assets/data2.yaml
    adapters:
      - Yaml                         # Convert data type is Yaml to string before save to file
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]
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
 * @end
 */
export default class Writer implements IElement {
  proxy: ElementProxy<Writer>

  title: string
  content: string
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
    this.title = this.proxy.getVar(this.title)
    this.content = this.proxy.getVar(this.content)
    this.path = this.proxy.resolvePath(this.path)
    if (!this.content) throw new Error('"content" is required')
    this._adapterClasses = this.adapters.reverse().map(adapter => {
      const adapterName = typeof adapter === 'string' ? adapter : Object.keys(adapter)[0]
      if (!adapterName) throw new Error('"adapters" is not valid')
      return {
        AdapterClass: FileAdapterFactory.GetAdapter(adapterName, this.proxy.scenario.extensions),
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
    await this._adapter.write(this.content)
    this.proxy.logger.debug('%s %s', chalk.magenta('- Write file to'), chalk.gray(this.path))
    console.groupEnd()
  }

}