# YAML Scene
Platform to do everything with only yaml scenario files.

## Some features
1. Support to create testcases for [REST APIs](./GUIDE), [gRPC](https://github.com/doanthuanthanh88/yas-grpc)
    - Auto generate to markdown document after done
    - Create mock API server with only a yaml file
    - Validate response after each steps
    - Easy to expose and extends all of elements

4. Split a huge testcase to many small testcases which make easy to test in a big project
5. Easy to extends, customize for specific project
6. Easy to load and reuse extensions via npm registry ([Generate sequence diagram](https://github.com/doanthuanthanh88/yas-sequence-diagram), [gRPC](https://github.com/doanthuanthanh88/yas-grpc)) or create a extension by yourself
7. Auto [generate sequence diagram](https://github.com/doanthuanthanh88/yas-sequence-diagram) from any file base on comment
9. Easy to do something with extensions
10. Easy to customize extensions and share them to everybody
11. Support to set password to scenario file before upload to public server to share to someone run it.

## Installation
```sh
  # Install via yarn
  yarn global add yaml-scene

  # OR Install via npm
  npm install -g yaml-scene
```

## Running
```sh
  yas $YAML_SCENE_FILE
```

## How to create a yaml scene file
Please follow [guideline document](./GUIDE.md) to create a scene file for your self.

## Examples
Please go to [here](./yaml-test/examples) to see examples

## Write a extension by yourself
- A [Extension template project](https://github.com/doanthuanthanh88/yaml-scene-extensions) which provides commands to unit test, build, document... to deploy to npm or something like that
- [Extension file](./yaml-test/examples/custom-extension/custom.js) which is implemented a extension interface

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

### Sharing extensions
1. [yas-sequence-diagram](https://github.com/doanthuanthanh88/yas-sequence-diagram)
2. [yas-grpc](https://github.com/doanthuanthanh88/yas-grpc)


### More information
- Project at [github](https://github.com/doanthuanthanh88/yaml-scene)
- Package at [npm](https://www.npmjs.com/package/yaml-scene)
- Docker images at [docker](https://hub.docker.com/repository/docker/doanthuanthanh88/yaml-scene)

#### Goodluck and fun :)