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
|[ReadFile](#ReadFile)| Read a file then set content to a variable ...|  
|[WriteFile](#WriteFile)| Write content to a file ...|  
| INPUT | --- |
|[ReadFile](#ReadFile)| Read a file then set content to a variable ...|  
|[UserInput](#UserInput)| Get user input from keyboard ...|  
| OUTPUT | --- |
|[Clear](#Clear)| Clear screen ...|  
|[Echo](#Echo)| Print data to screen ...|  
|[WriteFile](#WriteFile)| Write content to a file ...|  
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
title: Scene name                 # Scene name
description: Scene description    # Scene description
password:                         # File will be encrypted to $FILE_NAME.encrypt to share to someone run it for privacy
logLevel: debug                   # How to show log is debug)
                                  # - slient: Dont show anything
                                  # - error: Show error log
                                  # - warn: Show warning log
                                  # - info: Show infor, error log
                                  # - debug: Show log details, infor, error log ( Default )
                                  # - trace: Show all of log
extensions:                       # Extension elements.
  - ./cuz_extensions/custom1.js   # - Load elements from a file (Ex: elem1)
  - ./cuz_extensions/custom2.js   # - Load elements from a file (Ex: elem2)
  - ./cuz_extensions              # - Load elements from a folder (Ex: custom1~elem1, custom2~elem2)
  - yas-grpc                      # - Load elements from npm/yarn global dirs
vars:                             # Declare global variables, which can be replaced by env
  url: http://localhost:3000
  token: ...
steps:                            # Includes all which you want to do
  - !fragment ./scene1.yaml
  - !fragment ./scene2.yaml
  - elem1:                            
  - elem2:
  - custom1~elem1:
  - custom2~elem2:
  - call:                                 # Load doc from yas-grpc which declared in extensions
  - yas-sequence-diagram~SequenceDiagram: # Load yas-sequence-diagram from npm/yarn global dirs then use class SequenceDiagram to handle
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
    includes: 
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
```


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


## ReadFile <a name="ReadFile"></a>
Read a file then set content to a variable  
It uses `aes-128-cbc` to decrypt content with a password.  
Refer to [WriteFile](.) to encrypt content  

```yaml
### Text file
- ReadFile:
    title: Read text file 1 with password
    path: assets/data1.txt
    decrypt:
      password: thanh123
    var: data

- ReadFile:
    title: Read text file 2 without password
    path: assets/data2.txt
    var: data

### CSV File

- ReadFile/CSV:
    title: Read csv file 1 with password
    decrypt:
      password: thanh123
    path: assets/data1.csv
    var: data

- ReadFile/CSV:
    title: Read csv file 2 without password
    path: assets/data2.csv
    var: data

### JSON File

- ReadFile/JSON:
    title: Read json file 1 with password
    path: assets/data1.json
    decrypt:
      password: thanh123
    var: data

- ReadFile/JSON:
    title: Read json file 2 without password
    path: assets/data2.json
    var: data

### XML file

- ReadFile/XML:
    title: Read xml file 1 with password
    path: assets/data1.xml
    decrypt:
      password: thanh123
    var: data

- ReadFile/XML:
    title: Read xml file 2 without password
    path: assets/data2.xml
    var: data

### YAML file

- ReadFile/YAML:
    title: Read yaml file 1 with password
    path: assets/data1.yaml
    decrypt:
      password: thanh123
    var: data

- ReadFile/YAML:
    title: Read yaml file 2 without password
    path: assets/data2.yaml
    var: data

```


## WriteFile <a name="WriteFile"></a>
Write content to a file  
It uses `aes-128-cbc` to encrypt content with a password.  
Refer to [ReadFile](.) to decrypt content  

```yaml
### Text file
- WriteFile:
    title: Write text file with password
    encrypt:
      password: thanh123
    path: assets/data1.txt
    content: |
      Hello world

- WriteFile:
    title: Write text file without password
    path: assets/data2.txt
    content: |
      Hello world

### CSV File

- WriteFile/CSV:
    title: Write csv file 1 with password
    path: assets/data1.csv
    encrypt:
      password: thanh123
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile/CSV:
    title: Write csv file 2 without password
    path: assets/data2.csv
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]

### JSON File

- WriteFile/JSON:
    title: Write json file 1 with password
    encrypt:
      password: thanh123
    path: assets/data1.json
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile/JSON:
    title: Write json file 2 without password
    path: assets/data2.json
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]

### XML File

- WriteFile/XML:
    title: Write xml file 1 with password
    encrypt:
      password: thanh123
    path: assets/data1.xml
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile/XML:
    title: Write xml file 2 without password
    path: assets/data2.xml
    content:
      name: name 1
      age: 1
      class: 01

### YAML File

- WriteFile/YAML:
    title: Write yaml file 1 with password
    encrypt:
      password: thanh123
    path: assets/data1.yaml
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile/YAML:
    title: Write yaml file 2 without password
    path: assets/data2.yaml
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]

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
        ->: base    # Declare a template with name is "base"
        baseURL: http://localhost

- Get:
    <-: base        # Extends "base" in template then add more information or overrided them before executing
    url: /product/:id
    params:
      id: 1
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


  