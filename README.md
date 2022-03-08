# YAML Scene
Create scenes to do everything base on yaml file

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