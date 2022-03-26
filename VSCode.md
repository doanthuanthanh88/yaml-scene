# Integrate with vscode

## Scenario suggestion

1. Install `redhat.vscode-yaml` to suggest and validate scenario yaml file

2. Add config to `.vscode/settings.json` then all of files which end withs '.yas.yaml' will be suggested.

> Please generate `schema.json` by using command `yas schema`.  
> Read more `CLI` in [Wiki pages](https://github.com/doanthuanthanh88/yaml-scene/wiki)

```json
{
    "yaml.customTags": [
        "!binary scalar",
        "!fragment scalar",
        "!function scalar",
    ],
    "yaml.schemas": {
        "https://raw.githubusercontent.com/doanthuanthanh88/yaml-scene/main/schema.json": "*.yas.yaml"
    }
}
```

