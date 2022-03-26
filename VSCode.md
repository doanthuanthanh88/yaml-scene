# Integrate with vscode

## Scenario suggestion

1. Install `redhat.vscode-yaml` to suggest and validate scenario yaml file

2. Add config to `.vscode/settings.json` then all of files which end withs '.yas.yaml' will be suggested.

> Please generate `~/yaml-scene.yas.json` by using command `yas schema`.  
> Read more [CLI](https://github.com/doanthuanthanh88/yaml-scene#cli)

```json
{
    "yaml.customTags": [
        "!binary scalar",
        "!fragment scalar",
        "!function scalar",
    ],
    "yaml.schemas": {
        "~/yaml-scene.yas.json": "*.yas.yaml"
    }
}
```

