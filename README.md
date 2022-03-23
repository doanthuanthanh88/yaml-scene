# YAML Scene
It's a platform to do everything with only yaml scenario files

## Features
1. Split a huge testcase to many small testcases which make easy to test in a big project
2. Flexible to use, easy to extends, customize for specific project
3. Easy to install and reuse extensions via npm registry or create a extension by yourself
5. Easy to do something with extensions
6. Easy to customize extensions and share them to everybody
7. Support to set password to scenario file before upload to public server to share to someone run it.
8. Provide docker image to run it without installation

## Some extensions
1. [yas-http](https://github.com/doanthuanthanh88/yas-http): Manage http(s) request, mocking api server, create testcases, generate to document...
2. [yas-grpc](https://github.com/doanthuanthanh88/yas-grpc): Manage gRPC request, mocking gRPC server, create testcases, generate to document...
3. [yas-sequence-diagram](https://github.com/doanthuanthanh88/yas-sequence-diagram): Generate to sequence diagram, flow diagram base on comment in code

## Guideline document
> [GUIDELINE DOCUMENT](./GUIDE.md)

## Installation
Install via `npm` or `yarn`

```sh
  npm install -g yaml-scene   # yarn global add yaml-scene
```


## CLI
1. Run a scenario `my_scenario.yaml`
```sh
  yas my_scenario.yaml
```

2. Install new extensions
```sh
  yas add yas-http yas-grpc
```

3. Uninstall extensions
```sh
  yas remove yas-http yas-grpc
```

4. Run scenario via docker container
```sh
  yas docker \
    --dir "yaml-test/examples" \
    --extensions "yas-http yas-grpc" \
    --env-file .env \
    --env "name=thanh;age=11" \
    echo.yaml
```

5. Show version
```sh
  yas -v
```

6. Show help content
```sh
  yas -h
  yas add -h
  yas remove -h
  yas docker -h
```

## How to use a new extensions
1. There are 2 options to install a new extension
    1. Install a new extension (example: yas-http) via `npm` or `yarn`
    ```sh
      # Install via yarn
      yarn global add yas-http

      # OR Install via npm
      npm install -g yas-http
    ```
    2. Install via `yas add` command
    ```sh
      yas add yas-http yas-grpc
    ```

2. Create a `scenario.yaml` 
```yaml
- yas-http/Get:
    url: http://localhost:8000
    var: responseContent

# Print response to debug
- Echo: ${responseContent}
```

## Running
```sh
  yas $YAML_SCENE_FILE $PASSWORD
```

- `$YAML_SCENE_FILE`: Path to scenario file
- `$PASSWORD`: Password to run encrypted scenario file which contains property "password" in scenario file content. [More](./GUIDE.md)

## Create a new extension
Clone [Extension template project](https://github.com/doanthuanthanh88/yaml-scene-extensions) which includes examples, commands to unit test, build, document... to deploy to npm or something like that

- [Simple extension file](./yaml-test/examples/custom-extension/custom.js)

## How to create a yaml scene file
Please follow [guideline document](./GUIDE.md) to create a scene file for your self.

## Examples
Please go to [here](./yaml-test/examples) to see examples

## Sharing scenarios

1. Auto download a mp3 file from youtube
  - YouChoose a quality mp3 by yourself  
  - Pick a section in the file  
  
  > **GUIDE**

  1. Download a encrypted scenario is [here](./yaml-test/examples/download_youtube) with password is `example`
  2. Run on local
  ```sh
    yas ./yaml-test/examples/download_youtube example
  ```
  3. Run via docker
  ```sh
    docker run --it \
    -v ./Downloads:/Downloads \
    -v ./download_youtube:/test/download_youtube \
    doanthuanthanh88/yaml-scene \
    yas /test/download_youtube example
  ```

### More information
- Project at [github](https://github.com/doanthuanthanh88/yaml-scene)
- Package at [npm](https://www.npmjs.com/package/yaml-scene)
- Docker images at [docker](https://hub.docker.com/repository/docker/doanthuanthanh88/yaml-scene)

#### Goodluck and fun :)