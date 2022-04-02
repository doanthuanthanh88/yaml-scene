# Document
*Describe all of elements in tool. (meaning, how to use...)*
| Element | Description |  
|---|---|  
| !TAGS | --- |
|[!function](#!Tags%2F!function)| Write code as a function in js ...|  
|[!tag](#!Tags%2F!tag)| Lazy load tag ...|  
|[!tag tags/binary](#!Tags%2F!tag%20tags%2Fbinary)| Transform file/URL to binary ...|  
| +FILE.ADAPTER | --- |
|[Csv](#File%2C%20%2BFile.Adapter%2FCsv)| Read and write csv file. Used in File/Writer, File/Reader ...|  
|[Excel](#File%2C%20%2BFile.Adapter%2FExcel)| Read and write excel file. Used in File/Writer, File/Reader ...|  
|[Json](#File%2C%20%2BFile.Adapter%2FJson)| Read and write json file. Used in File/Writer, File/Reader ...|  
|[Password](#File%2C%20%2BFile.Adapter%2FPassword)| Read and write a encrypted file (`aes-128-cbc`). Used in File/Writer, File/Reader ...|  
|[Text](#File%2C%20%2BFile.Adapter%2FText)| Read and write text file. Used in File/Writer, File/Reader ...|  
|[Xml](#File%2C%20%2BFile.Adapter%2FXml)| Read and write xml file. Used in File/Writer, File/Reader ...|  
|[Yaml](#File%2C%20%2BFile.Adapter%2FYaml)| Read and write yaml file. Used in File/Writer, File/Reader ...|  
| DOC | --- |
|[Doc/Guide/MD](#Doc%2FDoc%2FGuide%2FMD)| Auto scan file to detect the comment format which is generated to markdown document ...|  
| EXTERNAL | --- |
|[Exec](#External%2FExec)| Execute external command ...|  
|[Script/Js](#External%2FScript%2FJs)| Embed javascript code into scene ...|  
|[Script/Sh](#External%2FScript%2FSh)| Embed shell script into scene ...|  
| FILE | --- |
|[Csv](#File%2C%20%2BFile.Adapter%2FCsv)| Read and write csv file. Used in File/Writer, File/Reader ...|  
|[Excel](#File%2C%20%2BFile.Adapter%2FExcel)| Read and write excel file. Used in File/Writer, File/Reader ...|  
|[File/Reader](#File%2C%20Input%2FFile%2FReader)| Read a file then set content to a variable ...|  
|[File/Writer](#File%2C%20Output%2FFile%2FWriter)| Write content to a file ...|  
|[Json](#File%2C%20%2BFile.Adapter%2FJson)| Read and write json file. Used in File/Writer, File/Reader ...|  
|[Password](#File%2C%20%2BFile.Adapter%2FPassword)| Read and write a encrypted file (`aes-128-cbc`). Used in File/Writer, File/Reader ...|  
|[Text](#File%2C%20%2BFile.Adapter%2FText)| Read and write text file. Used in File/Writer, File/Reader ...|  
|[Xml](#File%2C%20%2BFile.Adapter%2FXml)| Read and write xml file. Used in File/Writer, File/Reader ...|  
|[Yaml](#File%2C%20%2BFile.Adapter%2FYaml)| Read and write yaml file. Used in File/Writer, File/Reader ...|  
| INPUT | --- |
|[File/Reader](#File%2C%20Input%2FFile%2FReader)| Read a file then set content to a variable ...|  
|[UserInput](#Input%2FUserInput)| Get user input from keyboard ...|  
| OUTPUT | --- |
|[Clear](#Output%2FClear)| Clear screen ...|  
|[Echo](#Output%2FEcho)| Print data to screen ...|  
|[File/Writer](#File%2C%20Output%2FFile%2FWriter)| Write content to a file ...|  
| --- | --- |
|[Delay](#Delay)| Program will be delayed at here after specific time then it keeps playing next steps ...|  
|[Fragment](#Fragment)| Import a scenario file (URL or file local) in the scenario. ...|  
|[Group](#Group)| Group contains 1 or many elements ...|  
|[Pause](#Pause)| Program will be paused and wait user input ...|  
|[Templates](#Templates)| Declare elements which not `inited` or `run` ...|  
|[Validate](#Validate)| Validate data in running progress ...|  
|[Vars](#Vars)| Declare variables in scene ...|  
  
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

- Delay:
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
  global: false                                     # Install extension to global (npm install -g)
  localPath: ./                                     # Install extensions to local path (npm install --prefix $localPath/node_modules)
  dependencies:
    - lodash
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
## !function <a name="!Tags%2F!function"></a>  
`(!Tags)`  
Write code as a function in js  

```yaml
- Script/Js: !function |
    console.log('oldAge', age)
    await $.proxy.setVar('newAge', age + 10)
```

<br/>

## !tag <a name="!Tags%2F!tag"></a>  
`(!Tags)`  
Lazy load tag  

```yaml
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file: !tag
        tags/binary: ~/data.json
```

<br/>

## !tag tags/binary <a name="!Tags%2F!tag%20tags%2Fbinary"></a>  
`(!Tags)`  
Transform file/URL to binary
- File in local path
- File from url  

```yaml
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file1: !tag
        tags/binary: ~/data.json
      file2: !tag
        tags/binary: https://raw....
```

<br/>

## Csv <a name="File%2C%20%2BFile.Adapter%2FCsv"></a>  
`(File, +File.Adapter)`  
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

## Excel <a name="File%2C%20%2BFile.Adapter%2FExcel"></a>  
`(File, +File.Adapter)`  
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

## Json <a name="File%2C%20%2BFile.Adapter%2FJson"></a>  
`(File, +File.Adapter)`  
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

## Password <a name="File%2C%20%2BFile.Adapter%2FPassword"></a>  
`(File, +File.Adapter)`  
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

## Text <a name="File%2C%20%2BFile.Adapter%2FText"></a>  
`(File, +File.Adapter)`  
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

## Xml <a name="File%2C%20%2BFile.Adapter%2FXml"></a>  
`(File, +File.Adapter)`  
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

## Yaml <a name="File%2C%20%2BFile.Adapter%2FYaml"></a>  
`(File, +File.Adapter)`  
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

## Doc/Guide/MD <a name="Doc%2FDoc%2FGuide%2FMD"></a>  
`(Doc)`  
Auto scan file to detect the comment format which is generated to markdown document  
```yaml
- Doc/Guide/MD:
    # pattern:
    #   begin: ^\s*\*\s@guide\\s*$         # Default pattern
    #   end: \s*\*\s@end\\s*$              # Default pattern
    includes:
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
```

** Code example **

```js
/**
 * @guide
 * @name Element1
 * @description Embed javascript code into scene
***Details***

 * @h1 ##
Could not combine `@h1` and `@h2` in same guideline block
More information above detail block

 * @h2 ##
Could not combine `@h1` and `@h2` in same guideline block
More information below detail block

 * @group Tag1, Tag2
 * @exampleType custom
 * @example
**Example**
```js
console.log('Hello world')
``\`
 \* @end
 *\/
class Element1 {

}
```
- `@guide`: Begin scan a new guideline block
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
- `@end`: Mark to scan done a guideline block

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

## Exec <a name="External%2FExec"></a>  
`(External)`  
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

## Script/Js <a name="External%2FScript%2FJs"></a>  
`(External)`  
Embed javascript code into scene  

```yaml
- Vars:
    name: 10

- Script/Js:
    title: Test something
    content: !function |
      console.log('oldValue', name)
      await $.proxy.setVar('newName', name + 10)      # `$` is referenced to `Js` element in `Script`

- Script/Js: !function |
    console.log('oldValue', name)
    $.proxy.vars.newName = name + 10                  # `$` is referenced to `Js` element in `Script`

- Echo: New value ${newName}
```

<br/>

## Script/Sh <a name="External%2FScript%2FSh"></a>  
`(External)`  
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

## File/Reader <a name="File%2C%20Input%2FFile%2FReader"></a>  
`(File, Input)`  
Read a file then set content to a variable

File adapters:

- [Read a text file](#File%2C%20%2BFile.Adapter%2FText)
- [Read a csv file](#File%2C%20%2BFile.Adapter%2FCsv)
- [Read a json file](#File%2C%20%2BFile.Adapter%2FJson)
- [Read a xml file](#File%2C%20%2BFile.Adapter%2FXml)
- [Read a yaml file](#File%2C%20%2BFile.Adapter%2FYaml)
- [Read a excel file](#File%2C%20%2BFile.Adapter%2FExcel)
- [Read a encrypted file](#File%2C%20%2BFile.Adapter%2FPassword)  
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

## File/Writer <a name="File%2C%20Output%2FFile%2FWriter"></a>  
`(File, Output)`  
Write content to a file
File adapters:

- [Read a text file](#File%2C%20%2BFile.Adapter%2FText)
- [Read a csv file](#File%2C%20%2BFile.Adapter%2FCsv)
- [Read a json file](#File%2C%20%2BFile.Adapter%2FJson)
- [Read a xml file](#File%2C%20%2BFile.Adapter%2FXml)
- [Read a yaml file](#File%2C%20%2BFile.Adapter%2FYaml)
- [Read a excel file](#File%2C%20%2BFile.Adapter%2FExcel)
- [Read a encrypted file](#File%2C%20%2BFile.Adapter%2FPassword)  
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

## UserInput <a name="Input%2FUserInput"></a>  
`(Input)`  
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

## Clear <a name="Output%2FClear"></a>  
`(Output)`  
Clear screen  

```yaml
- Clear:
```

<br/>

## Echo <a name="Output%2FEcho"></a>  
`(Output)`  
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

## Delay <a name="Delay"></a>  
Program will be delayed at here after specific time then it keeps playing next steps  

```yaml
- Delay: 10s
- Delay:
    title: Delay 10s
    time: 10s

- Delay: 10m
- Delay:
    title: Delay 10 minutes
    time: 10m

- Delay: 10h
- Delay:
    title: Delay 10 hours
    time: 10h

- Delay: 1000
- Delay:
    title: Delay 1000 miliseconds
    time: 1000
```

<br/>

## Fragment <a name="Fragment"></a>  
Import a scenario file (URL or file local) in the scenario.  

```yaml
- Fragment: http://raw.github.../scenario1.yas.yaml

- Fragment:
    title: Load from another file
    file: ./scenario1.yas.yaml
    password: $PASS_TO_DECRYPT
```

<br/>

## Group <a name="Group"></a>  
Group contains 1 or many elements  

```yaml
- Group:
    title: Run async jobs
    stepDelay: 2s
    steps:
      - Group:
          async: true
          delay: 1s
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

<br/>

## Pause <a name="Pause"></a>  
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

## Templates <a name="Templates"></a>  
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

## Validate <a name="Validate"></a>  
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
```

<br/>

## Vars <a name="Vars"></a>  
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

