# Document
*Describe all of elements in tool. (meaning, how to use...)*
| Element | Description |  
|---|---|  
| !TAGS | --- |
|[!fragment](#!fragment)| Load scenes from another file into current file ...|  
|[!function](#!function)| Write code as a function in js ...|  
|[!binary](#!binary)| Transform file to binary ...|  
| DOC | --- |
|[Doc/Guide/MD](#Doc/Guide/MD)| Auto scan file to detect the comment format which is generated to markdown document ...|  
| EXTERNAL | --- |
|[Exec](#Exec)| Execute external command ...|  
|[Script/Js](#Script/Js)| Embed javascript code into scene ...|  
|[Script/Sh](#Script/Sh)| Embed shell script into scene ...|  
| FILE | --- |
|[File/Reader](#File/Reader)| Read a file then set content to a variable ...|  
|[File/Writer](#File/Writer)| Write content to a file ...|  
| INPUT | --- |
|[File/Reader](#File/Reader)| Read a file then set content to a variable ...|  
|[UserInput](#UserInput)| Get user input from keyboard ...|  
| OUTPUT | --- |
|[Clear](#Clear)| Clear screen ...|  
|[Echo](#Echo)| Print data to screen ...|  
|[File/Writer](#File/Writer)| Write content to a file ...|  
| --- | --- |
|[Delay](#Delay)| Program will be delayed at here after specific time then it keeps playing next steps ...|  
|[Group](#Group)| Group contains 1 or many elements ...|  
|[Pause](#Pause)| Program will be paused and wait user input ...|  
|[Templates](#Templates)| Declare elements which not `inited` or `run` ...|  
|[Validate](#Validate)| Validate data in running progress ...|  
|[Vars](#Vars)| Declare variables in scene ...|  
  
# Default attributes
Attributes in all of elements  


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
          $.proxy.setVar('begin', Date.now())   # `$` is referenced to `Js` element in `Script`
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
steps:                                              # Includes all which you want to do
  - !fragment ./scene1.yas.yaml
  - !fragment ./scene2.yas.yaml
  - extension_name1:
  - extensions_folders/custom1:
  - Script/Js: |
      require('lodash').merge({}, {})
  - yas-sequence-diagram~SequenceDiagram:           # Load yas-sequence-diagram from npm/yarn global dirs then use class SequenceDiagram to handle
```


# Simple Scenario file
A simple scenario file  

```yaml
- !fragment ./scene1.yas.yaml
- !fragment ./scene2.yas.yaml
```


  
# Details
## !fragment <a name="!fragment"></a>
Load scenes from another file into current file  

```yaml
- Group: 
    steps:
      - !fragment ./examples/scene_1.yas.yaml
      - Echo: Loaded scene 1 successfully

      - !fragment ./examples/scene_2.yas.yaml
      - Echo: Loaded scene 2 successfully
```


## !function <a name="!function"></a>
Write code as a function in js  

```yaml
- Script/Js: !function |
    console.log('oldAge', age)
    $.proxy.setVar('newAge', age + 10)
```


## !binary <a name="!binary"></a>
Transform file to binary  

```yaml
- yas-http/Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file: !binary ~/data.json
```


## Doc/Guide/MD <a name="Doc/Guide/MD"></a>
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

> This guideline have generated by this


## Exec <a name="Exec"></a>
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


## Script/Js <a name="Script/Js"></a>
Embed javascript code into scene  

```yaml
- Vars:
    name: 10

- Script/Js: !function |
    console.log('oldValue', name)
    $.proxy.setVar('newName', name + 10)      # `$` is referenced to `Js` element in `Script`

- Echo: New value ${newName}
```


## Script/Sh <a name="Script/Sh"></a>
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
      echo ${$.tempFile}
      echo ${name}
      echo $1
      echo $2

- Script/Sh:
    title: My command
    args:                           # Custom run script
      - sh                          # Executor
      - ${$.tempFile}               # Temp script file which includes content script and is removed after done
    content: |                      # Content script
      echo ${$.tempFile}            # `$` is referenced to `Sh` element in `Script`
      echo ${name}
      echo $1
      echo $2
```


## File/Reader <a name="File/Reader"></a>
Read a file then set content to a variable  
It uses `aes-128-cbc` to decrypt content with a password.  
Refer to [File/Writer](.) to encrypt content  
### Text file

```yaml
- File/Reader:
    title: Read text file 1 with password
    path: assets/data1.txt
    adapters:
      - Password: MyPassword        # Decrypt content with password is "MyPassword"
    var: data                       # Set file content result to "data" variable
    
- File/Reader:
    title: Read text file 2 without password
    path: assets/data2.txt
    var: data                       # Set file content result to "data" variable
```

### CSV File

```yaml
- File/Reader:
    title: Read csv file 1 with password
    path: assets/data1.csv
    adapters:
      - Password: MyPassword        # The first is decrypt content after read file
      - Csv                         # The second convert data type is Csv to object
    var: data                       # Set file content result to "data" variable

- File/Reader:
    title: Read csv file 2 without password
    path: assets/data2.csv
    adapters:
      - Csv                         # Convert data type is Csv to object
    var: data                       # Set file content result to "data" variable
```

### JSON File

```yaml
- File/Reader:
    title: Read json file 1 with password
    path: assets/data1.json         # File content is { field1: value1 }
    adapters:
      - Password: MyPassword        # The first is decrypt content after read file
      - Json                        # The second convert data type is Json to object
    var: data                       # Set file content result to "data" variable
    var:
      myVar: ${_.field1}            # Extract `field1` in file content to `myVar`.
                                    # - `_` is file content data after is parsed

- File/Reader:
    title: Read json file 2 without password
    path: assets/data2.json
    adapters:
      - Json                        # Convert data type is Json to object
    var: data                       # Set file content result to "data" variable
```

### XML file

```yaml
- File/Reader:
    title: Read xml file 1 with password
    path: assets/data1.xml
    adapters:
      - Password: MyPassword        # The first is decrypt content after read file
      - Xml                         # The second convert data type is Xml to object
    var: data                       # Set file content result to "data" variable

- File/Reader:
    title: Read xml file 2 without password
    path: assets/data2.xml
    adapters:
      - Xml                         # Convert data type is Xml to object
    var: data                       # Set file content result to "data" variable
```

### YAML file

```yaml
- File/Reader:
    title: Read yaml file 1 with password
    path: assets/data1.yaml
    adapters:
      - Password: MyPassword        # The first is decrypt content after read file
      - Yaml                        # The second convert data type is Csv to object
    var: data                       # Set file content result to "data" variable

- File/Reader:
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

## File/Writer <a name="File/Writer"></a>
Write content to a file  
It uses `aes-128-cbc` to encrypt content with a password.  
Refer to [File/Reader](.) to decrypt content  
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

## UserInput <a name="UserInput"></a>
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
        - title: Female
          value: -1

    - title: Suggest Sex
      type: autocomplete
      var: suggestSex
      choices:
        - title: Male
          value: 1
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
        - title: Backet ball
          value: id1

    - title: Suggest Hobby
      type: autocompleteMultiselect
      var: suggestHobbies
      choices:
        - title: Play football
          value: id0
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


## Clear <a name="Clear"></a>
Clear screen  

```yaml
- Clear:
```


## Echo <a name="Echo"></a>
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
    color: green
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
```


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


  
# How to create a new extension
You can create a new extension in local or publish to npm registry

Please reference the below links for details:  
- A [Extension template project](https://github.com/doanthuanthanh88/yaml-scene-extensions) which provides commands to unit test, build, document... to deploy to npm or something like that
- [Extension files](./yaml-test/examples/custom-extension) which implemented extension interface  

