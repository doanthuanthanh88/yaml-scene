# Document
Describe all of elements in tool. (meaning, how to use...)

| Element | Description |  
|---|---|  
| !TAGS | --- |
|[!function](#user-content-!tags-!function)| Write code as a function in js ...|  
|[!tag](#user-content-!tags-!tag)| Lazy load tag ...|  
|[!tag file](#user-content-!tags-!tag%20file)| Transform file/URL to a file reader which includes adapters ...|  
|[!tag file/buffer](#user-content-!tags-!tag%20file%2fbuffer)| Transform file/URL to buffer ...|  
|[!tag file/json](#user-content-!tags-!tag%20file%2fjson)| Transform file/URL to json object ...|  
|[!tag file/stream](#user-content-!tags-!tag%20file%2fstream)| Transform file/URL to stream ...|  
|[!tag file/text](#user-content-!tags-!tag%20file%2ftext)| Transform file/URL to text ...|  
| DOC | --- |
|[Doc/Guide/MD](#user-content-doc-doc%2fguide%2fmd)| Auto scan file to detect the comment format which is generated to markdown document ...|  
| EXTERNAL | --- |
|[Exec](#user-content-external-exec)| Execute external command ...|  
|[Script/Js](#user-content-external-script%2fjs)| Embed javascript code into scene ...|  
|[Script/Sh](#user-content-external-script%2fsh)| Embed shell script into scene ...|  
| FILE | --- |
|[File/Reader](#user-content-file%2c%20input-file%2freader)| Read a file then set content to a variable ...|  
|[File/Writer](#user-content-file%2c%20output-file%2fwriter)| Write content to a file ...|  
| FILE.ADAPTER | --- |
|[Csv](#user-content-file.adapter-csv)| Read and write csv file. Used in File/Writer, File/Reader ...|  
|[Excel](#user-content-file.adapter-excel)| Read and write excel file. Used in File/Writer, File/Reader ...|  
|[Json](#user-content-file.adapter-json)| Read and write json file. Used in File/Writer, File/Reader ...|  
|[Password](#user-content-file.adapter-password)| Read and write a encrypted file (`aes-128-cbc`). Used in File/Writer, File/Reader ...|  
|[Text](#user-content-file.adapter-text)| Read and write text file. Used in File/Writer, File/Reader ...|  
|[Xml](#user-content-file.adapter-xml)| Read and write xml file. Used in File/Writer, File/Reader ...|  
|[Yaml](#user-content-file.adapter-yaml)| Read and write yaml file. Used in File/Writer, File/Reader ...|  
| INPUT | --- |
|[File/Reader](#user-content-file%2c%20input-file%2freader)| Read a file then set content to a variable ...|  
|[UserInput](#user-content-input-userinput)| Get user input from keyboard ...|  
| OUTPUT | --- |
|[Clear](#user-content-output-clear)| Clear screen ...|  
|[Echo](#user-content-output-echo)| Print data to screen ...|  
|[File/Writer](#user-content-file%2c%20output-file%2fwriter)| Write content to a file ...|  
| --- | --- |
|[Fragment](#user-content--fragment)| Import a scenario file (URL or file local) in the scenario. ...|  
|[Group](#user-content--group)| Group contains 1 or many elements ...|  
|[Pause](#user-content--pause)| Program will be paused and wait user input ...|  
|[Templates](#user-content--templates)| Declare elements which not `inited` or `run` ...|  
|[Validate](#user-content--validate)| Validate data in running progress ...|  
|[Vars](#user-content--vars)| Declare variables in scene ...|  
  
# Default attributes
Attributes in all of elements  


## async
Run element asynchronized which not blocked others  

```yaml
- Group:
    title: Run async jobs
    stepDelay: 2s
    steps:
      - Group:
          async: true
          steps:
            - Echo: Hello 1
      - Group:
          async: true
          steps:
            - Echo: Hello 2
      - Group:
          async: true
          steps:
            - Echo: Hello 3
```


## delay
Delay after a specific time before keep playing the nexts  

```yaml
- Group:
    title: Delay all of steps in a group
    stepDelay: 1s
    steps:
      - Script/Js: |
          $.proxy.vars.begin = Date.now()   # `$` is referenced to `Js` element in `Script`
      - Echo: ${Date.now() - begin}
      - Echo: ${Date.now() - begin}

- Group:
    title: Pause or delay
    steps:
      - Echo: <step 1>
      - Pause:
          title: step 2 run after 2s
          time: 2s
      - Echo: <step 2>
```


## if
Check condition before decided to run this element or not  

```yaml
- Vars:
    isEnd: true

- Echo:
    if: ${sayHello}
    title: Hello

- Pause:
    if: ${sayHello}
    time: 1s
    title: Delay 1s before say goodbye after say hello

- Echo:
    if: ${!sayHello}
    title: Goodbye
```


## loop
Loop element in Array, Object or any conditional  

```yaml
# Loop in array
- Vars:
    i: 0
    arr: [1, 2, 3, 4, 5]
    obj:
      name: name 1
      age: 123

- Echo: Init

- Group:
    title: Loop each of items in an array
    loop: ${arr}
    steps:
      - Echo: key is ${$$.loopKey}
      - Echo: value is ${$$.loopValue}

- Group:
    title: Loop each of props in an object
    loop: ${obj}
    steps:
      - Echo: key is ${$$.loopKey}
      - Echo: value is ${$$.loopValue}

- Group:
    title: Loop with specific condition ${i}
    loop: ${i < 10}
    steps:
      - Echo: ${i++}
      - Vars:
          i: ${i+1}
```


# Standard Scenario file
A standard scenario file  

```yaml
title: Scene name                                   # Scene name
description: Scene description                      # Scene description
password:                                           # File will be encrypted to $FILE_NAME.encrypt to share to someone run it for privacy
logLevel: debug                                     # How to show log is debug)
                                                    # - slient: Dont show anything
                                                    # - error: Show error log
                                                    # - warn: Show warning log
                                                    # - info: Show infor, error log
                                                    # - debug: Show log details, infor, error log ( Default )
                                                    # - trace: Show all of log
install:                                            # Install extensions from npm registry
  local:                                            # Install extensions to local path (npm install --prefix $path/node_modules)
    path: ./                                        # There are some type of path
                                                    # - ./test/:  Relative path from folder which includes a scenario file
                                                    # - test/:    Relative path from folder which includes a scenario file
                                                    # - ~/test:   Relative path from user home directory
                                                    # - #/test:   Relative path from yaml-scene/src
                                                    # - /test:    Absolute path
    dependencies:
      - lodash
  global:                                           # Install extension to global (npm install -g)
    dependencies:
      - axios

extensions:                                         # Extension elements.
  extension_name1: ./cuz_extensions/custom1.js      # - Load a element in a file with exports.default (extension_name1:)
  extensions_folders: ./cuz_extensions              # - Load elements in files in the folder with file name is element name (extensions_folders/custom1:)
vars:                                               # Declare global variables, which can be replaced by env
  url: http://localhost:3000                        # env URL=
  token: ...                                        # env TOKEN=
  user:
    id_test: 1                                      # env USER_ID_TEST=
stepDelay: 1s                                       # Each of steps will delay 1s before play the next
steps:                                              # Includes all which you want to do (URL or file local)
  - Fragment ./scene1.yas.yaml
  - Fragment ./scene2.yas.yaml
  - extension_name1:
  - extensions_folders/custom1:
  - Script/Js: |
      require('lodash').merge({}, {})
  - yas-sequence-diagram~SequenceDiagram:           # Load yas-sequence-diagram from npm/yarn global dirs then use class SequenceDiagram to handle
```


# Simple Scenario file
A simple scenario file  

```yaml
- Fragment ./scene1.yas.yaml                        # Includes all which you want to do (URL or file local)
- Fragment ./scene2.yas.yaml
```


  
# Details
<a id="user-content-!tags-!function" name="user-content-!tags-!function"></a>
## !function
`!Tags`  
Write code as a function in js  

```yaml
- Script/Js: !function |
    console.log('oldAge', age)
    await $.proxy.setVar('newAge', age + 10)
```

<br/>

<a id="user-content-!tags-!tag" name="user-content-!tags-!tag"></a>
## !tag
`!Tags`  
Lazy load tag  

```yaml
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file: !tag
        file/stream: ~/data.json
```

<br/>

<a id="user-content-!tags-!tag%20file" name="user-content-!tags-!tag%20file"></a>
## !tag file
`!Tags`  
Transform file/URL to a file reader which includes adapters
- File in local path
- File from url  

```yaml
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file1: !tag
        file:
          path: ~/data.json
          adapters:
            - Json
      file2: !tag
        file:
          path: https://raw....
          adapters:
            - Text
```

<br/>

<a id="user-content-!tags-!tag%20file%2fbuffer" name="user-content-!tags-!tag%20file%2fbuffer"></a>
## !tag file/buffer
`!Tags`  
Transform file/URL to buffer
- File in local path
- File from url  

```yaml
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file1: !tag
        file/buffer: ~/data.json
      file2: !tag
        file/buffer: https://raw...
```

<br/>

<a id="user-content-!tags-!tag%20file%2fjson" name="user-content-!tags-!tag%20file%2fjson"></a>
## !tag file/json
`!Tags`  
Transform file/URL to json object
- File in local path
- File from url  

```yaml
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file1: !tag
        file/json: ~/data.json
      file2: !tag
        file/json: https://raw....
```

<br/>

<a id="user-content-!tags-!tag%20file%2fstream" name="user-content-!tags-!tag%20file%2fstream"></a>
## !tag file/stream
`!Tags`  
Transform file/URL to stream
- File in local path
- File from url  

```yaml
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file1: !tag
        file/stream: ~/data.json
      file2: !tag
        file/stream: https://raw....
```

<br/>

<a id="user-content-!tags-!tag%20file%2ftext" name="user-content-!tags-!tag%20file%2ftext"></a>
## !tag file/text
`!Tags`  
Transform file/URL to text
- File in local path
- File from url  

```yaml
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file1: !tag
        file/text: ~/data.json
      file2: !tag
        file/text: https://raw....
```

<br/>

<a id="user-content-doc-doc%2fguide%2fmd" name="user-content-doc-doc%2fguide%2fmd"></a>
## Doc/Guide/MD
`Doc`  
Auto scan file to detect the comment format which is generated to markdown document  
```yaml
- Doc/Guide/MD:
    title: Guideline document
    description: Describe all of elements in tool. (meaning, how to use...)
    # pattern:
    #   begin: ^\s*\/\*{5}\s*$             # Default pattern
    #   end:   ^\s*\*{1,}\/\s*$            # Default pattern
    prefixHashLink:                        # Default is `user-content-` for github
    includes:
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
```

** Code example **

```js
/*****
@name Element1
@description Embed javascript code into scene
***Details***

@h1 ##
Could not combine `@h1` and `@h2` in same guideline block
More information above detail block

@h2 ##
Could not combine `@h1` and `@h2` in same guideline block
More information below detail block

@group Tag1, Tag2
@exampleType custom
@example
**Example**
```js
console.log('Hello world')
``\`
*\/
class Element1 {

}
```
- `/*****`: Begin scan a new guideline block
- `@name`: Element name
- `@description`: Element description. (Markdown format)
- `@exampleType`: This is content type in hightlight code block in markdown. \`\`\`yaml ... \`\`\`
  - Default is `yaml`
  - If the value is `custom` then content in example will be used as markdown format. (Not hightlight code block)
- `@example`: Some examples for this element.
  - Content type depends on `@exampleType`
    - Default is `yaml`.
    - If `@exampleType` is `custom` then this will used as markdown format
    - Otherwise, it used hightlight code block \`\`\` ... \`\`\` in markdown
- `@group`: Group this element.
  - Separate by `, `.
  - Example: `Tag 1, Tag 2`
- `@order`: Priority position display this element in a same group
  - Example: 1.
  - Default: 5
- `@h1`: Describe header in markdown (#, ##...). This content is markdown format which show above document details block. Could not combine `@h1` and `@h2` in same guideline block
- `@h2`: Describe header in markdown (#, ##...). This content is markdown format which show below document details block. Could not combine `@h1` and `@h2` in same guideline block
- `*\/`: Mark to scan done a guideline block

**Header position**

```js
-----------------------MENU------------------------
Menu name which not be set `@h1` or `@h2`.
Menu will be grouped by `@group` and show as table
------------------------H1-------------------------
List `@h1` content
----------------------DETAILS----------------------
List content which not includes `@h1` and `@h2`
------------------------H2-------------------------
List `@h2` content
---------------------------------------------------
```

> This guideline is generated by this

<br/>

<a id="user-content-external-exec" name="user-content-external-exec"></a>
## Exec
`External`  
Execute external command  

```yaml
- Exec:
    title: Show yarn global directories
    args:
      - yarn
      - global
      - dir
    var:                                  # Get log content or exit code
      logContent: ${$.messages}           # `$` is referenced to `Exec` element
      exitCode: ${$.code}
```

<br/>

<a id="user-content-external-script%2fjs" name="user-content-external-script%2fjs"></a>
## Script/Js
`External`  
Embed javascript code into scene  

```yaml
- Vars:
    name: 10
    age: 10

- Script/Js:
    title: Test something
    content: !function |
      console.log('oldValue', name)
      await $.proxy.setVar('newName', name + 10)      # `$` is referenced to `Js` element in `Script`

- Script/Js: !function |
    console.log('oldValue', name)
    $.proxy.vars.newName = name + 10                  # `$` is referenced to `Js` element in `Script`

- Script/Js: !function |
    ({ name, age })                                        # For best performance, you should add this line to asks vm provides some variables, not at all
    console.log('oldValue', name)
    $.proxy.vars.newName = name + 10                  # `$` is referenced to `Js` element in `Script`

- Echo: New value ${newName}
```

<br/>

<a id="user-content-external-script%2fsh" name="user-content-external-script%2fsh"></a>
## Script/Sh
`External`  
Embed shell script into scene  

```yaml
- Vars:
    name: 'thanh'

### Short
- Script/Sh: |
    echo '${name}'
    yarn global dir

### Full
- Script/Sh:
    title: My command               # Job title
    bin: sh                         # Path to executor
    mode: 777                       # chmod
    content: |                      # Content script
      echo ${$._tempFile}
      echo ${name}
      echo $1
      echo $2

- Script/Sh:
    title: My command
    args:                           # Custom run script
      - sh                          # Executor
      - ${$._tempFile}               # Temp script file which includes content script and is removed after done
    content: |                      # Content script
      echo ${$._tempFile}            # `$` is referenced to `Sh` element in `Script`
      echo ${name}
      echo $1
      echo $2
```

<br/>

<a id="user-content-file%2c%20input-file%2freader" name="user-content-file%2c%20input-file%2freader"></a>
## File/Reader
`File, Input`  
Read a file then set content to a variable

File adapters:

- [Read a text file](#user-content-file.adapter-text)
- [Read a csv file](#user-content-file.adapter-csv)
- [Read a json file](#user-content-file.adapter-json)
- [Read a xml file](#user-content-file.adapter-xml)
- [Read a yaml file](#user-content-file.adapter-yaml)
- [Read a excel file](#user-content-file.adapter-excel)
- [Read a encrypted file](#user-content-file.adapter-password)  
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
<br/>

<a id="user-content-file%2c%20output-file%2fwriter" name="user-content-file%2c%20output-file%2fwriter"></a>
## File/Writer
`File, Output`  
Write content to a file
File adapters:

- [Read a text file](#user-content-file.adapter-text)
- [Read a csv file](#user-content-file.adapter-csv)
- [Read a json file](#user-content-file.adapter-json)
- [Read a xml file](#user-content-file.adapter-xml)
- [Read a yaml file](#user-content-file.adapter-yaml)
- [Read a excel file](#user-content-file.adapter-excel)
- [Read a encrypted file](#user-content-file.adapter-password)  
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
<br/>

<a id="user-content-file.adapter-csv" name="user-content-file.adapter-csv"></a>
## Csv
`File.Adapter`  
Read and write csv file. Used in File/Writer, File/Reader  

```yaml
- File/Reader:
    title: Read a csv file
    path: assets/data1.csv
    adapters:
      - Csv
    var: data                       # Set file content result to "data" variable

- File/Writer:
    title: Write to csv file
    path: assets/data2.csv
    adapters:
      - Csv
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3
```

<br/>

<a id="user-content-file.adapter-excel" name="user-content-file.adapter-excel"></a>
## Excel
`File.Adapter`  
Read and write excel file. Used in File/Writer, File/Reader  

```yaml
- File/Reader:
    title: Read text file 1 with password
    path: assets/data1.xlsx
    adapters:
      - Excel: MyPassword           # Decrypt content with password is "MyPassword"
          sheets:                   # Read data only these sheets
            - name: Sheet 1         # Sheet name
              range: 'A1:C9'        # Only take cell in the region
              header:
                rows: 1             # Skip, dont take data in these rows
              columnToKey:          # Mapping column key (A,B,C) to name
                A: foo name
                B: qux label
                C: poo title
    var: data                       # Set file data result to "data" variable

- File/Writer:
    path: assets/data1.xlsx
    adapters:
      - Excel                       # Write data to excel format
    content: [{
      foo: 'bar',
      qux: 'moo',
      poo: null,
      age: 1
    },
    {
      foo: 'bar1',
      qux: 'moo2',
      poo: 444,
      age: 2
    }]
```

<br/>

<a id="user-content-file.adapter-json" name="user-content-file.adapter-json"></a>
## Json
`File.Adapter`  
Read and write json file. Used in File/Writer, File/Reader  

```yaml
- File/Reader:
    title: Read a json file
    path: assets/data1.json
    adapters:
      - Json
    var: data                       # Set file content result to "data" variable

- File/Writer:
    title: Write to json file
    path: assets/data2.json
    adapters:
      - Json
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3
```

<br/>

<a id="user-content-file.adapter-password" name="user-content-file.adapter-password"></a>
## Password
`File.Adapter`  
Read and write a encrypted file (`aes-128-cbc`). Used in File/Writer, File/Reader  

```yaml
- File/Reader:
    title: Read a json file
    path: assets/data1
    adapters:
      - Password: My Password       # The first: Decrypt file data with password
      - Json                        # The second: Parse data to json before return result
    var: data                       # Set file content result to "data" variable

- File/Writer:
    title: Write to json file
    path: assets/data2
    adapters:
      - Json                        # The first: Convert to json format
      - Password: My Password       # The second: Encrypt file content with password before save to file
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3
```

<br/>

<a id="user-content-file.adapter-text" name="user-content-file.adapter-text"></a>
## Text
`File.Adapter`  
Read and write text file. Used in File/Writer, File/Reader  

```yaml
- File/Reader:
    title: Read a text file
    path: assets/data1.txt
    adapters:                       # Not set, it use `Text` to default adapter
      - Text
    var: data                       # Set file content result to "data" variable

- File/Writer:
    title: Write to text file
    path: assets/data2.txt
    adapters:                       # Not set, it use `Text` to default adapter
      - Text
    content: |
      Hello world
```

<br/>

<a id="user-content-file.adapter-xml" name="user-content-file.adapter-xml"></a>
## Xml
`File.Adapter`  
Read and write xml file. Used in File/Writer, File/Reader  

```yaml
- File/Reader:
    title: Read a xml file
    path: assets/data1.xml
    adapters:
      - Xml
    var: data                       # Set file content result to "data" variable

- File/Writer:
    title: Write to xml file
    path: assets/data2.xml
    adapters:
      - Xml
    content:
      name: name 1
      age: 1
      class: 01
```

<br/>

<a id="user-content-file.adapter-yaml" name="user-content-file.adapter-yaml"></a>
## Yaml
`File.Adapter`  
Read and write yaml file. Used in File/Writer, File/Reader  

```yaml
- File/Reader:
    title: Read a yaml file
    path: assets/data1.yaml
    adapters:
      - Yaml
    var: data                       # Set file content result to "data" variable

- File/Writer:
    title: Write to yaml file
    path: assets/data2.yaml
    adapters:
      - Yaml
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3
```

<br/>

<a id="user-content-input-userinput" name="user-content-input-userinput"></a>
## UserInput
`Input`  
Get user input from keyboard  

```yaml
- UserInput:
    - title: Enter your name
      type: text # Default is text if not specific
      format: !function |
        vl => vl.toUpperCase()
      var: name
      required: true

    - title: Enter password
      type: password
      var: pass

    - title: Enter secret key
      type: invisible
      var: secret

    - title: Enter your age
      type: number
      var: age

    - title: Enter birthday
      type: date
      mask: YYYY-MM-DD HH:mm:ss # Default for date
      var: birthday

    - title: Enter current time
      type: date
      mask: HH:mm:ss
      var: time

    - title: Sex
      type: select
      var: sex
      default: -1
      choices:
        - title: Male
          value: 1
          description: Des
          disabled: false
        - title: Female
          value: -1

    - title: Suggest Sex
      type: autocomplete
      var: suggestSex
      choices:
        - title: Male
          value: 1
          description: Des
          disabled: false
        - title: Female
          value: -1

    - title: Hobby
      type: multiselect
      var: hobbies
      default:
        - id0
        - id1
      choices:
        - title: Play football
          value: id0
          description: Des
          disabled: false
        - title: Backet ball
          value: id1

    - title: Suggest Hobby
      type: autocompleteMultiselect
      var: suggestHobbies
      choices:
        - title: Play football
          value: id0
          description: Des
          disabled: false
        - title: Backet ball
          value: id1

    - title: Agree terms and conditions
      type: toggle
      var: agr
      required: true

    - title: Are you sure to submit ?
      type: confirm
      default: true
      var: submit
```

<br/>

<a id="user-content-output-clear" name="user-content-output-clear"></a>
## Clear
`Output`  
Clear screen  

```yaml
- Clear:
```

<br/>

<a id="user-content-output-echo" name="user-content-output-echo"></a>
## Echo
`Output`  
Print data to screen  

```yaml
- Echo: Hello world                       # Print white text

- Echo/Green: Green text                  # Print green text

- Echo/Blue: Blue text                    # Print blue text

- Echo/Red: Red text                      # Print red text

- Echo/Yellow: Yellow text                # Print yellow text

- Echo/Cyan: Cyan text                    # Print cyan text

- Echo/Gray: Gray text                    # Print gray text

- Echo:
    message: Hello
    color: green.bgRed
    pretty: true

- Vars:
    user:
      name: thanh
      sex: male

- Echo/Schema: ${user}                    # Print object schema

- Echo/Schema:
    message: ${user}
    color: gray
    pretty: true
```

<br/>

<a id="user-content--fragment" name="user-content--fragment"></a>
## Fragment
Import a scenario file (URL or file local) in the scenario.  

```yaml
- Fragment: http://raw.github.../scenario1.yas.yaml

- Fragment:
    file: ./scenario1.yas.yaml
    password: $PASS_TO_DECRYPT
    title: Override title in scenario
    description: ""                       # Hide description in scenario
    logLevel: slient                      # hide logger in scenario
    vars:                                 # Override variables value which is only declared in `vars` in the scenario file
      varInScenario1: override here
```

<br/>

<a id="user-content--group" name="user-content--group"></a>
## Group
Group contains 1 or many elements  

```yaml
- Group:
    title: Run async jobs
    stepDelay: 2s
    steps:
      - Group:
          async: true
          delay: 1s
          stepAsync: true
          steps:
            - Echo: Hello 1
            - Echo: Hello 1.1
      - Group:
          async: true
          steps:
            - Echo: Hello 2
      - Group:
          async: true
          steps:
            - Echo: Hello 3
```

<br/>

<a id="user-content--pause" name="user-content--pause"></a>
## Pause
Program will be paused and wait user input  

```yaml
- Pause:
    title: It keeps playing when user enter OR after 1 second, user not enter then it keeps playing
    timeout: 1s

- Pause: 2s       # Delay 2 seconds then it keeps playing

- Pause:
    title: Delay 3 seconds then it keeps playing
    time: 3s

- Pause:          # It will be paused until user enter
```

<br/>

<a id="user-content--templates" name="user-content--templates"></a>
## Templates
Declare elements which not `inited` or `run`
It's only used for `extends` or `inherit` purposes  

```yaml
- Templates:
    - Get:
        ->: base1    # Declare a template with name is "base"
        baseURL: http://localhost:3001

- Templates:
    base2: # Declare a template with name is "base"
      Get:
        baseURL: http://localhost:3000

- Get:
    <-: base1        # Extends "base1" in template then add more information or overrided them before executing
    url: /product/:id
    params:
      id: 1

- Get:
    <-: base2        # Extends "base2" in template then add more information or overrided them before executing
    url: /product/:id
    params:
      id: 2
```

<br/>

<a id="user-content--validate" name="user-content--validate"></a>
## Validate
Validate data in running progress
Currently only support chai `https://www.chaijs.com`  

```yaml
- Validate:
    title: Expect method
    chai: ${expect(userInfo).to.have.property('display_name')}
- Validate:
    title: Should method
    chai: ${userInfo.display_name.should.equal('thanh');}
- Validate:
    title: Assert method
    chai: ${assert.equal(userInfo.display_name, 'thanh');}
- Validate:
    title: Assert method          # Not define "chai" then it auto passes

- Vars:
    age: 10
- Validate:
    title: Customize validate by code
    chai: !function |
      if (age <= 10) assert.fail('Age must be greater than 10')
```

<br/>

<a id="user-content--vars" name="user-content--vars"></a>
## Vars
Declare variables in scene  

```yaml
- Vars:
    userA:
      name: thanh
      age: 11

- Echo: ${userA}
- Echo: ${userA.name}
```

<br/>

  
# How to create a new extension
You can create a new extension in local or publish to npm registry

Please reference the below links for details:
- A [Extension template project](https://github.com/doanthuanthanh88/yaml-scene-extensions) which provides commands to unit test, build, document... to deploy to npm or something like that
- [Extension files](./yaml-test/examples/custom-extension) which implemented extension interface  

