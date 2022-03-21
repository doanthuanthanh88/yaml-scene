# Document
*Describe all of elements in tool. (meaning, how to use...)*
| Element | Description |  
|---|---|  
| !TAGS | --- |
|[!fragment](#!fragment)| Load scenes from another file into current file ...|  
|[!binary](#!binary)| Transform file to binary ...|  
| API | --- |
|[Api](#Api)| Send a request via http with custom method ...|  
|[Api/Delete](#Api/Delete)| Send a DELETE request via http ...|  
|[Api/Get](#Api/Get)| Send a GET request via http ...|  
|[Api/Patch](#Api/Patch)| Send a Patch request via http ...|  
|[Api/Post](#Api/Post)| Send a Post request via http ...|  
|[Api/Put](#Api/Put)| Send a Put request via http ...|  
|[Api/Head](#Api/Head)| Send a Head request via http ...|  
|[Api/Options](#Api/Options)| Send a Options request via http ...|  
|[Api/Server](#Api/Server)| Mock API server ...|  
|[Api/Summary](#Api/Summary)| Summary after all of apis in scene executed done. ...|  
|[Doc/Api/MD](#Doc/Api/MD)| Document api to markdown format ...|  
| DOC | --- |
|[Doc/Api/MD](#Doc/Api/MD)| Document api to markdown format ...|  
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
|[Group](#Group)| Group contains 1 or many elements ...|  
|[Pause](#Pause)| Program will be paused and wait user input ...|  
|[Sleep](#Sleep)| Program will be delayed at here after specific time then it keeps playing next steps ...|  
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

- Sleep:
    if: ${sayHello}
    title: Sleep before say goodbye after say hello

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
          _.proxy.setVar('begin', Date.now())
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
  extensions:
    - yas-grpc
    - yas-sequence-diagram
extensions:                                         # Extension elements.
  extension_name1: ./cuz_extensions/custom1.js      # - Load a element in a file with exports.default (extension_name1:)
  extensions_folders: ./cuz_extensions              # - Load elements in files in the folder with file name is element name (extensions_folders/custom1:)
vars:                                               # Declare global variables, which can be replaced by env
  url: http://localhost:3000
  token: ...
stepDelay: 1s                                       # Each of steps will delay 1s before play the next
steps:                                              # Includes all which you want to do
  - !fragment ./scene1.yaml
  - !fragment ./scene2.yaml
  - extension_name1:
  - extensions_folders/custom1:
  - yas-sequence-diagram~SequenceDiagram:           # Load yas-sequence-diagram from npm/yarn global dirs then use class SequenceDiagram to handle
```


# Simple Scenario file
A simple scenario file  

```yaml
- !fragment ./scene1.yaml
- !fragment ./scene2.yaml
```


  
# Details
## !fragment <a name="!fragment"></a>
Load scenes from another file into current file  

```yaml
- Group: 
    steps:
      - !fragment ./examples/scene_1.yaml
      - Echo: Loaded scene 1 successfully

      - !fragment ./examples/scene_2.yaml
      - Echo: Loaded scene 2 successfully
```


## !binary <a name="!binary"></a>
Transform file to binary  

```yaml
- Post:
    url: http://localhost/upload
    headers:
      content-type: multipart/form-data
    body:
      file: !binary ~/data.json
```


## Api <a name="Api"></a>
Send a request via http with custom method  

```yaml
- Api:
    title: Update a product                                     # Api name
    description: It's only serve content for admin              # Api description
    doc: true                                                   # Push it to queue to export to doc in element `Doc/Api/MD`
    method: PUT                                                 # Request method (GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD)
    baseURL: http://localhost:3000                              
    url: /product/:id
    params:                                                     # Request params. (In the example, url is "/product/1")
      id: 1
    query:                                                      # Request querystring (In the example, url is appended "?order=name")
      order: name
    headers:                                                    # Request headers
      authorization: ...
    body: {                                                     # Request body which used in [POST, PUT, PATCH...] methods
      name: "thanh",
      file: !binary ./my_file.txt                               # Use !binary to upload a file to server (content-type: multipart/form-data)
    }
    timeout: 1s                                                 # Request timeout
    saveTo: /file_downloaded.txt                                # Request file from server then download and save to this path
    validate:                                                   # Validate response after request done. (Reference to #Validate)
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
```


## Api/Delete <a name="Api/Delete"></a>
Send a DELETE request via http  

```yaml
- Api/Delete:
    title: Delete a product                                     # Api name
    description: It's only serve content for admin              # Api description
    doc: true                                                   # Push it to queue to export to doc in element `Doc/Api/MD`
    baseURL: http://localhost:3000                              
    url: /product/:id
    params:                                                     # Request params. (In the example, url is "/product/1")
      id: 1
    query:                                                      # Request querystring (In the example, url is appended "?order=name")
      order: name
    headers:                                                    # Request headers
      authorization: ...
    timeout: 1s                                                 # Request timeout
    validate:                                                   # Validate response after request done. (Reference to #Validate)
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
```


## Api/Get <a name="Api/Get"></a>
Send a GET request via http  

```yaml
- Api/Get:
    title: Get product details                                  # Api name
    description: It's only serve content for admin              # Api description
    doc: true                                                   # Push it to queue to export to doc in element `Doc/Api/MD`
    baseURL: http://localhost:3000                              
    url: /product/:id
    params:                                                     # Request params. (In the example, url is "/product/1")
      id: 1
    query:                                                      # Request querystring (In the example, url is appended "?order=name")
      order: name
    headers:                                                    # Request headers
      authorization: ...
    timeout: 1s                                                 # Request timeout
    saveTo: /file_downloaded.txt                                # Request file from server then download and save to this path
    validate:                                                   # Validate response after request done. (Reference to #Validate)
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
```


## Api/Patch <a name="Api/Patch"></a>
Send a Patch request via http  

```yaml
- Api/Patch:
    title: Update a product                                     # Api name
    description: It's only serve content for admin              # Api description
    doc: true                                                   # Push it to queue to export to doc in element `Doc/Api/MD`
    baseURL: http://localhost:3000                              
    url: /product/:id
    params:                                                     # Request params. (In the example, url is "/product/1")
      id: 1
    query:                                                      # Request querystring (In the example, url is appended "?order=name")
      order: name
    headers:                                                    # Request headers
      authorization: ...
    body: {                                                     # Request body which used in [POST, PUT, PATCH...] methods
      name: "thanh",
      file: !binary ./my_file.txt                               # Use !binary to upload a file to server (content-type: multipart/form-data)
    }
    timeout: 1s                                                 # Request timeout
    validate:                                                   # Validate response after request done. (Reference to #Validate)
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
```


## Api/Post <a name="Api/Post"></a>
Send a Post request via http  

```yaml
- Api/Post:
    title: Create a new product                                 # Api name
    description: It's only serve content for admin              # Api description
    doc: true                                                   # Push it to queue to export to doc in element `Doc/Api/MD`
    baseURL: http://localhost:3000                              
    url: /:companyID/product
    params:                                                     # Request params. (In the example, url is "/1/product")
      companyID: 1
    query:                                                      # Request querystring (In the example, url is appended "?order=name")
      order: name
    headers:                                                    # Request headers
      authorization: ...
    body: {                                                     # Request body which used in [POST, PUT, PATCH...] methods
      name: "thanh",
      file: !binary ./my_file.txt                               # Use !binary to upload a file to server (content-type: multipart/form-data)
    }
    timeout: 1s                                                 # Request timeout
    validate:                                                   # Validate response after request done. (Reference to #Validate)
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
```


## Api/Put <a name="Api/Put"></a>
Send a Put request via http  

```yaml
- Api/Put:
    title: Update a product                                     # Api name
    description: It's only serve content for admin              # Api description
    doc: true                                                   # Push it to queue to export to doc in element `Doc/Api/MD`
    baseURL: http://localhost:3000                              
    url: /product/:id
    params:                                                     # Request params. (In the example, url is "/product/1")
      id: 1
    query:                                                      # Request querystring (In the example, url is appended "?order=name")
      order: name
    headers:                                                    # Request headers
      authorization: ...
    body: {                                                     # Request body which used in [POST, PUT, PATCH...] methods
      name: "thanh",
      file: !binary ./my_file.txt                               # Use !binary to upload a file to server (content-type: multipart/form-data)
    }
    timeout: 1s                                                 # Request timeout
    validate:                                                   # Validate response after request done. (Reference to #Validate)
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
```


## Api/Head <a name="Api/Head"></a>
Send a Head request via http  

```yaml
- Api/Head:
    title: Check product is availabled                          # Api name
    description: It's only serve content for admin              # Api description
    doc: true                                                   # Push it to queue to export to doc in element `Doc/Api/MD`
    baseURL: http://localhost:3000                              
    url: /product/:id
    params:                                                     # Request params. (In the example, url is "/product/1")
      id: 1
    query:                                                      # Request querystring (In the example, url is appended "?order=name")
      order: name
    headers:                                                    # Request headers
      authorization: ...
    timeout: 1s                                                 # Request timeout
    validate:                                                   # Validate response after request done. (Reference to #Validate)
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
```


## Api/Options <a name="Api/Options"></a>
Send a Options request via http  

```yaml
- Api/Options:
    title: Test CORs a product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
```


## Api/Server <a name="Api/Server"></a>
Mock API server  
- Server static file
- Support upload file then save to server
- Server RESTFul API data 
- Create APIs which auto handle CRUD data  

```yaml
- Api/Server:
    title: Mock http request to serve data
    https: true                                 # Server content via https
    https:                                      # Server content via https with custom cert and key
      key: 
      cert: 
    host: 0.0.0.0                               # Server host
    port: 8000                                  # Server port

    routers:                                    # Defined routes

      # Server static files
      - serveIn: [./assets]                     # All of files in list will be served after request to

      # Server upload API
      - path: /upload                           # Upload path. Default method is POST
        method: POST                            # Request method (POST, PUT, PATCH, DELETE, HEAD)
                                                # - Default method is POST
        uploadTo: ./uploadDir                   # Directory includes uploading files

      # Create APIs which auto handle CRUD data
      - path: '/posts'                          # Request path
        CRUD: true                              # Auto create full RESTful API
                                                # - GET    /posts            : Return list posts
                                                # - GET    /posts/:id        : Return post details by id
                                                # - POST   /posts            : Create a new post
                                                # - PUT    /posts/:id        : Replace entity of post to new post
                                                # - PATCH  /posts/:id        : Only update some properties of post
                                                # - DELETE /posts/:id        : Delete a post by id
        init: [                                 # Init data
          {
            "id": 1,
            "label": "label 01"
          }
        ]

      # Create a API which you can customize response, path....
      - method: GET                             # Request method (POST, PUT, PATCH, DELETE, HEAD)
                                                # - Default method is GET
        path: /posts/:id                        # Request path
        response:                               # Response data
          status: 200                           # - Response status
          statusMessage: OK                     # - Response status message
          headers:                              # - Response headers
            server: nginx
          data: [                               # - Response data. 
            {                                   #   - Use some variables to replace value to response
              "id": ${+$params.id},             # $params:  Request params (/:id)
              "title": "title 1",               # $headers: Request headers
              "author": "thanh"                 # $query:   Request querystring (?name=thanh)
              "des": "des 1",                   # $body:    Request body
            }                                   # $request: Request
          ]                                     # $ctx:     Context
```


## Api/Summary <a name="Api/Summary"></a>
Summary after all of apis in scene executed done.  

```yaml
- Api/Summary:
    title: Testing result
```


## Doc/Api/MD <a name="Doc/Api/MD"></a>
Document api to markdown format  

```yaml
- Doc/Api/MD:
    title: Post service
    description: Demo CRUD API to generate to markdown document
    signature: "[Doan Thuan Thanh](mailto:doanthuanthanh88@gmail.com)"
    outFile: ./api_document_details.md
```


## Doc/Guide/MD <a name="Doc/Guide/MD"></a>
Auto scan file to detect the comment format which is generated to markdown document  
```yaml
- Doc/Guide/MD: 
    # pattern:
    #   begin: ^\s*\*\s@guide\\s*$         # Default pattern
    #   end: \s*\*\s@end\\s*$              # Default pattern
    #   noTag:                             # Default get all of line after the latest tag
    includes: 
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
```

** Code example **

```js
/**
 * @guide 
 * @name  Element1
 * @description  Embed javascript code into scene
***Details***

 * @h1  ##
Could not combine `@h1` and `@h2` in same guideline block
More information above detail block

 * @h2  ##
Could not combine `@h1` and `@h2` in same guideline block
More information below detail block

 * @group  Tag1, Tag2
 * @exampleType  custom
 * @example 
**Example**  
```js
console.log('Hello world')
``\`
 \* @end 
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
```


## Script/Js <a name="Script/Js"></a>
Embed javascript code into scene  

```yaml
- Vars:
    name: 10

- Script/Js: |
    console.log('oldValue', name)
    _.proxy.setVar('newName', name + 10)

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
    args:
      - sh          # Specific path to sh or bash binary
      - ${_.file}   # This content will be writed to this path then execute it
      - arg1
      - arg2
    content: |
      echo ${_.file}
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
    path: assets/data1.json
    adapters:
      - Password: MyPassword        # The first is decrypt content after read file
      - Json                        # The second convert data type is Json to object
    var: data                       # Set file content result to "data" variable

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
      - Json                         # Convert data type is Json to string before save to file
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

- Pause: 2s       # Sleep 2 seconds then it keeps playing

- Pause:
    title: Sleep 3 seconds then it keeps playing
    time: 3s

- Pause:          # It will be paused until user enter
```


## Sleep <a name="Sleep"></a>
Program will be delayed at here after specific time then it keeps playing next steps  

```yaml
- Sleep: 10s
- Sleep: 
    title: Sleep 10s
    time: 10s

- Sleep: 10m
- Sleep: 
    title: Sleep 10 minutes
    time: 10m

- Sleep: 10h
- Sleep: 
    title: Sleep 10 hours
    time: 10h

- Sleep: 1000
- Sleep: 
    title: Sleep 1000 miliseconds
    time: 1000
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
    title: Validate number
    chai: ${expect(10).to.equal(200)}
- Validate:
    title: Test response
    chai: ${expect(userInfo).to.have.property('display_name')}
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

