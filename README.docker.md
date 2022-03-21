# YAML Scene
Platform to do everything with only yaml scenario files.

# Installation
```sh
  docker pull doanthuanthanh88/yaml-scene:latest
```

# Running

**Run a default scene**
```sh
  docker run -it -e -v $YOUR_SCENE_PATH:/test doanthuanthanh88/yaml-scene /test/$YOUR_SCENE_FILE.yaml
```

**Run with some extensions**
```sh
  docker run -it -e "EXTENSIONS=$EXTENSION_1 $EXTENSION_2" -v $YOUR_SCENE_PATH:/test doanthuanthanh88/yaml-scene /test/$YOUR_SCENE_FILE.yaml
```

**Run with a scene which is encrypted by password**
```sh
  docker run -it -v $YOUR_SCENE_PATH:/test doanthuanthanh88/yaml-scene /test/$YOUR_SCENE_FILE.yaml $PASSWORD
```

# More information
- Project at [github](https://github.com/doanthuanthanh88/yaml-scene)
- Package at [npm](https://www.npmjs.com/package/yaml-scene)
- Docker images at [docker](https://hub.docker.com/repository/docker/doanthuanthanh88/yaml-scene)