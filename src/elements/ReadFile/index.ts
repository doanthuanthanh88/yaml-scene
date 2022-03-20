import { File } from '@app/utils/adapter/file/File';
import { FileAdapterFactory } from '@app/utils/adapter/file/FileAdapterFactory';
import { IFileAdapter } from '@app/utils/adapter/file/IFileAdapter';
import chalk from 'chalk';
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy';

/**
 * @guide
 * @name ReadFile
 * @description Read a file then set content to a variable  
It uses `aes-128-cbc` to decrypt content with a password.  
Refer to [WriteFile](.) to encrypt content
 * @group File, Input
 * @exampleType custom
 * @example
### Text file

```yaml
- ReadFile:
    title: Read text file 1 with password
    path: assets/data1.txt
    adapters:
      - Password: MyPassword        # Decrypt content with password is "MyPassword"
    var: data                       # Set file content result to "data" variable

- ReadFile:
    title: Read text file 2 without password
    path: assets/data2.txt
    var: data                       # Set file content result to "data" variable
```

### CSV File

```yaml
- ReadFile:
    title: Read csv file 1 with password
    path: assets/data1.csv
    adapters:
      - Password: MyPassword        # The first is decrypt content after read file
      - Csv                         # The second convert data type is Csv to object
    var: data                       # Set file content result to "data" variable

- ReadFile:
    title: Read csv file 2 without password
    path: assets/data2.csv
    adapters:
      - Csv                         # Convert data type is Csv to object
    var: data                       # Set file content result to "data" variable
```

### JSON File

```yaml
- ReadFile:
    title: Read json file 1 with password
    path: assets/data1.json
    adapters:
      - Password: MyPassword        # The first is decrypt content after read file
      - Json                        # The second convert data type is Json to object
    var: data                       # Set file content result to "data" variable

- ReadFile:
    title: Read json file 2 without password
    path: assets/data2.json
    adapters:
      - Json                        # Convert data type is Json to object
    var: data                       # Set file content result to "data" variable
```

### XML file

```yaml
- ReadFile:
    title: Read xml file 1 with password
    path: assets/data1.xml
    adapters:
      - Password: MyPassword        # The first is decrypt content after read file
      - Xml                         # The second convert data type is Xml to object
    var: data                       # Set file content result to "data" variable

- ReadFile:
    title: Read xml file 2 without password
    path: assets/data2.xml
    adapters:
      - Xml                         # Convert data type is Xml to object
    var: data                       # Set file content result to "data" variable
```

### YAML file

```yaml
- ReadFile:
    title: Read yaml file 1 with password
    path: assets/data1.yaml
    adapters:
      - Password: MyPassword        # The first is decrypt content after read file
      - Yaml                        # The second convert data type is Csv to object
    var: data                       # Set file content result to "data" variable

- ReadFile:
    title: Read yaml file 2 without password
    path: assets/data2.yaml
    adapters:
      - Yaml                        # Convert data type is Yaml to object
    var: data                       # Set file content result to "data" variable
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
  - ReadFile:
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
export default class ReadFile {
  proxy: ElementProxy<ReadFile>

  title: string
  var: string
  path: string
  adapters: (string | object)[]

  #adapter: IFileAdapter
  #adapterClasses: {
    AdapterClass: any,
    args?: any
  }[]
  decrypt: {
    password: string
  }

  init(props: any) {
    merge(this, props)
    if (!this.adapters) this.adapters = []
    if (!Array.isArray(this.adapters)) this.adapters = [this.adapters]
    if (!this.adapters.length) this.adapters.push('Text')
  }

  prepare() {
    this.path = this.proxy.resolvePath(this.path)
    this.#adapterClasses = this.adapters.map(adapter => {
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

    this.#adapterClasses.forEach(({ AdapterClass, args }) => {
      this.#adapter = new AdapterClass(this.#adapter || new File(this.path), args)
    })

    const obj = await this.#adapter.read()

    if (this.var) this.proxy.setVar(this.var, obj)
    this.proxy.logger.debug('%s %s', chalk.magenta('- Read file at'), chalk.gray(this.path))
    console.groupEnd()
    return obj
  }

}