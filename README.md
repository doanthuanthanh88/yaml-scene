# YAML Scene
It's a platform to do everything with only yaml scenario files.  
Because it's a platform, so you can easy to create extensions by yourself or use extensions which is shared by others.

## Features
1. Split a huge scenario file to many small files which make easy to run in a big project
2. Flexible to use, easy to extends, customize for specific project
3. Easy to install and reuse extensions via npm registry or create a extension by yourself
4. Easy to customize or create new extensions and share them to everybody or reused in projects
5. Support encrypt a scenario file and run the encrypted scenario file
6. Provide docker image to run it without installation
7. Support run a scenario file, load extensions from both local files and remote files (http(s)
8. Auto generate a json schema for suggestion and validation

<br/>

## Installation
Install via `npm` or `yarn`

```sh
  npm install -g yaml-scene   # yarn global add yaml-scene
```

## How to run
1. Create a `scenario file` with the below content

```yaml
# Make a http request to http://localhost:8000/index.html
- yas-http/Get:
    baseURL: http://localhost:8000
    url: /index.html
    var: responseContent

# Print response content to console
- Echo: ${responseContent}
```
2. Run the scenario
```sh
  yas $YAML_SCENE_FILE $PASSWORD
```

- `$YAML_SCENE_FILE`: Path to scenario file
- `$PASSWORD`: Password to run encrypted scenario file which contains property "password" in scenario file content.

## Docker image
```sh
docker pull doanthuanthanh88/yaml-scene:latest
```

Run via docker
```sh
  docker run --rm -it doanthuanthanh88/yaml-scene $YAML_SCENE_FILE $PASSWORD
```

<br/>

## Extensions
1. [yas-http](https://github.com/doanthuanthanh88/yas-http): Manage http(s) request, mocking api server, create testcases, generate to document...
2. [yas-grpc](https://github.com/doanthuanthanh88/yas-grpc): Manage gRPC request, mocking gRPC server, create testcases, generate to document...
3. [yas-sequence-diagram](https://github.com/doanthuanthanh88/yas-sequence-diagram): Generate to sequence diagram, flow diagram base on comment in code
4. [yas-redis](https://github.com/doanthuanthanh88/yas-redis): A redis client

> You can [build a extension](#create-a-new-extension) by yourself

<br/>

## Guideline document
- **[Wiki Pages](https://github.com/doanthuanthanh88/yaml-scene/wiki)**  
- Integrate with **[Visual Studio Code](https://github.com/doanthuanthanh88/yaml-scene/wiki/Visual-Studio-Code)**

## Sharing
- [Sharing scenario and components](./sharing/README.md)

<br/>

## How to create a yaml scene file
Please follow [wiki pages](https://github.com/doanthuanthanh88/yaml-scene/wiki) to create a scene file for your self.

<br/>

## Examples
Please go to [here](./yaml-test/examples) to see examples

<br/>

## Create a new extension
Please clone [Extension template project](https://github.com/doanthuanthanh88/yaml-scene-extensions) which includes examples, commands to unit test, build, document...

Or you can write [a simple extension js file](./yaml-test/examples/custom-extension/custom1.js)

<br/>

## CLI
1. Run a scenario `my_scenario.yas.yaml`
- From local file
  ```sh
    yas my_scenario.yas.yaml
  ```
- From remote file
  ```sh
    yas http://localhost/my_scenario.yas.yaml
  ```
  > Note: Pass `headers` via querystring to pass authentication, authorization.  
  > Ex: http://localhost/my_scenario.yas.yaml?headers={"Authorization":"..."}

2. Install new extensions
```sh
  yas add yas-http yas-grpc
```

3. Upgrade extensions
```sh
  yas up yas-http yas-grpc
```

4. Uninstall extensions
```sh
  yas rm yas-http yas-grpc
```

5. Show version
```sh
  yas -v
```

6. Show help content
```sh
  yas -h
```

<br/>

### More information
- Project at [github](https://github.com/doanthuanthanh88/yaml-scene)
- Package at [npm](https://www.npmjs.com/package/yaml-scene)
- Docker images at [docker](https://hub.docker.com/repository/docker/doanthuanthanh88/yaml-scene)

#### Goodluck and fun :)