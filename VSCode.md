# Integrate with vscode

## Scenario suggestion

1. Install `redhat.vscode-yaml` to suggest and validate scenario yaml file

2. Add config to `.vscode/settings.json` then all of files which end withs '.yas.yaml' will be suggested. [Json Schema](./schema.json)
```json
{
    "yaml.customTags": [
        "!binary scalar",
        "!fragment scalar",
        "!function scalar",
    ],
    "yaml.schemas": {
        "https://github.com/doanthuanthanh88/yaml-scene/blob/main/schema.json": "*.yas.yaml"
    }
}
```

