# Document
*Describe all of elements in tool. (meaning, how to use...)*
| Element | Description |  
|---|---|  
| API | --- |
|[Api~post](#Api~post)| Send a Post request via http|  
|[Api~patch](#Api~patch)| Send a Patch request via http|  
|[Api~put](#Api~put)| Send a Put request via http|  
|[Api~get](#Api~get)| Send a GET request via http|  
|[Api~del](#Api~del)| Send a DELETE request via http|  
|[Api~head](#Api~head)| Send a Head request via http|  
|[Api~options](#Api~options)| Send a Options request via http|  
|[Api~summary](#Api~summary)| Summary after all of apis in scene executed done.|  
| DOC | --- |
|[Doc~CommentGuide](#Doc~CommentGuide)| Auto scan file to detect the comment format which is generated to markdown document|  
| EXTERNAL | --- |
|[Exec](#Exec)| Execute external command|  
| FILE | --- |
|[ReadFile](#ReadFile)| Read a file then set content to a variable  
It uses `aes-128-cbc` to decrypt content with a password.  
Refer to [WriteFile](.) to encrypt content|  
|[WriteFile](#WriteFile)| Write content to a file  
It uses `aes-128-cbc` to encrypt content with a password.  
Refer to [ReadFile](.) to decrypt content|  
| INPUT | --- |
|[InputKeyboard](#InputKeyboard)| Get user input from keyboard|  
| TAGS | --- |
|[!fragment](#!fragment)| Load scenes from another file into current file|  
|[!binary](#!binary)| Transform file to binary|  
| --- | --- |
|[Clear](#Clear)| Clear screen|  
|[Echo](#Echo)| Print data to screen|  
|[Group](#Group)| Group contains 1 or many elements|  
|[Script~js](#Script~js)| Embed javascript code into scene|  
|[Script~sh](#Script~sh)| Embed shell script into scene|  
|[Templates](#Templates)| Declare elements which not `inited` or `run`  
It's only used for `extends` or `inherit` purposes|  
|[Validate](#Validate)| Validate data in running progress  
Currently only support chai `https://www.chaijs.com`|  
|[Vars](#Vars)| Declare variables in scene|  
  
# Standard Scenario file
*A standard scenario file*  
```yaml  
title: Scene name                 # Scene name
description: Scene description    # Scene description
logLevel: debug                   # How to show log is debug)
                                  # - slient: Dont show anything
                                  # - error: Show error log
                                  # - warn: Show warning log
                                  # - info: Show infor, error log
                                  # - debug: Show log details, infor, error log ( Default )
                                  # - trace: Show all of log
extensions:                       # Extension elements
  - ~/code/github/yaml-scene/yaml-test/extensions/custom.js
vars:                             # Declare global variables, which can be replaced by env
  url: http://localhost:3000
  token: ...
steps:                            # Includes all which you want to do
  - !fragment ./scene1.yaml
  - !fragment ./scene2.yaml
```
# Simple Scenario file
*A simple scenario file*  
```yaml  
- !fragment ./scene1.yaml
- !fragment ./scene2.yaml
```
  
# Details
## Api~post <a name="Api~post"></a>
Send a Post request via http  
```yaml
- Api~post:
    title: Create a new product
    baseURL: http://localhost:3000
    url: /product
    body:
      name: updated name
      quantity: 10
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
    var: newProduct
```
## Api~patch <a name="Api~patch"></a>
Send a Patch request via http  
```yaml
- Api~patch:
    title: Update product name
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    body:
      name: updated name
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
```
## Api~put <a name="Api~put"></a>
Send a Put request via http  
```yaml
- Api~put:
    title: Update product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: ${newProduct.id}
    body:
      name: updated name
      quantity: 11
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
    var: updatedProduct
```
## Api~get <a name="Api~get"></a>
Send a GET request via http  
```yaml
- Api~get:
    title: Get product details
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
```
## Api~del <a name="Api~del"></a>
Send a DELETE request via http  
```yaml
- Api~del:
    title: Delete a product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
```
## Api~head <a name="Api~head"></a>
Send a Head request via http  
```yaml
- Api~head:
    title: Ping a product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
```
## Api~options <a name="Api~options"></a>
Send a Options request via http  
```yaml
- Api~options:
    title: Test CORs a product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
```
## Api~summary <a name="Api~summary"></a>
Summary after all of apis in scene executed done.  
```yaml
- Api~summary:
    title: Testing result
```
## Doc~CommentGuide <a name="Doc~CommentGuide"></a>
Auto scan file to detect the comment format which is generated to markdown document  
```yaml
- Doc~CommentGuide: 
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

- ReadFile~csv:
    title: Read csv file 1 with password
    decrypt:
      password: thanh123
    path: assets/data1.csv
    var: data

- ReadFile~csv:
    title: Read csv file 2 without password
    path: assets/data2.csv
    var: data

### JSON File

- ReadFile~json:
    title: Read json file 1 with password
    path: assets/data1.json
    decrypt:
      password: thanh123
    var: data

- ReadFile~json:
    title: Read json file 2 without password
    path: assets/data2.json
    var: data

### XML file

- ReadFile~xml:
    title: Read xml file 1 with password
    path: assets/data1.xml
    decrypt:
      password: thanh123
    var: data

- ReadFile~xml:
    title: Read xml file 2 without password
    path: assets/data2.xml
    var: data

### YAML file

- ReadFile~yaml:
    title: Read yaml file 1 with password
    path: assets/data1.yaml
    decrypt:
      password: thanh123
    var: data

- ReadFile~yaml:
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

- WriteFile~csv:
    title: Write csv file 1 with password
    path: assets/data1.csv
    encrypt:
      password: thanh123
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile~csv:
    title: Write csv file 2 without password
    path: assets/data2.csv
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]

### JSON File

- WriteFile~json:
    title: Write json file 1 with password
    encrypt:
      password: thanh123
    path: assets/data1.json
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile~json:
    title: Write json file 2 without password
    path: assets/data2.json
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]

### XML File

- WriteFile~xml:
    title: Write xml file 1 with password
    encrypt:
      password: thanh123
    path: assets/data1.xml
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile~xml:
    title: Write xml file 2 without password
    path: assets/data2.xml
    content:
      name: name 1
      age: 1
      class: 01

### YAML File

- WriteFile~yaml:
    title: Write yaml file 1 with password
    encrypt:
      password: thanh123
    path: assets/data1.yaml
    content:
      - name: name 1
        age: 1
      - name: name 2
        age: 3

- WriteFile~yaml:
    title: Write yaml file 2 without password
    path: assets/data2.yaml
    content:
      - [name, age]
      - [name01, 1]
      - [name02, 2]

```
## InputKeyboard <a name="InputKeyboard"></a>
Get user input from keyboard  
```yaml
- InputKeyboard:
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
## Clear <a name="Clear"></a>
Clear screen  
```yaml
 - Clear:
```
## Echo <a name="Echo"></a>
Print data to screen  
```yaml
- Echo: Hello world
- Echo~green: Green text
- Echo~blue: Blue text
- Echo~red: Red text
- Echo~yellow: Yellow text
- Echo~cyan: Cyan text

- Vars:
    user:
      name: thanh
      lang: vi

- Echo.schema: ${user}
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
## Script~js <a name="Script~js"></a>
Embed javascript code into scene  
```yaml
- Vars:
    name: 10

- Script~js: |
    console.log('oldValue', name)
    _.proxy.setVar('newName', name + 10)

- Echo: New value ${newName}
```
## Script~sh <a name="Script~sh"></a>
Embed shell script into scene  
```yaml
- Vars:
    name: 'thanh'

### Short
- Script~sh: |
    echo '${name}'
    yarn global dir

### Full
- Script~sh:
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