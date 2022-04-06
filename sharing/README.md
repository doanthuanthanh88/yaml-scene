# Sharing
Includes sharing scenarios and components

# Components
A component is built base on base elements

| | Component Name | Password |
| --- | --- | --- |
| 1. | [Finder](https://raw.githubusercontent.com/doanthuanthanh88/yaml-scene/main/sharing/components/finder.yas.yaml) | |
| 2. | [Upload file to get download link](https://raw.githubusercontent.com/doanthuanthanh88/yas-http/main/sharing/upload/tmpfiles) | example |

<br/>

# Scenarios
A scenario combines components and base elements to do larger tasks

| | Scenario | Password |
| --- | --- | --- |
| 1. | [Pick file in current directory to upload to get download link](https://raw.githubusercontent.com/doanthuanthanh88/yas-http/main/sharing/upload/pick_file_to_upload.yas.yaml) | |
| 2. | [Download youtube mp3 file](https://raw.githubusercontent.com/doanthuanthanh88/yas-http/main/sharing/youtube_audio/download_youtube) | example |
| 3. | [Create mock server](https://raw.githubusercontent.com/doanthuanthanh88/yas-http/main/sharing/dynamic_server/Server.yaml) | |

<br/>

# How to run a scenario

## Run via `yaml-scene` in local
```sh
yas -f $SCENARIO_FILE_PATH_OR_URL
```

## Run via docker
```sh
docker run --rm -it --name mock-api-server \
  -v $PWD:/yaml-scene \
  doanthuanthanh88/yaml-scene \
  -f \
  $SCENARIO_FILE_PATH_OR_URL
```