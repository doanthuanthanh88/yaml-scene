# Integrate with vscode

## Scenario suggestion

1. Install `redhat.vscode-yaml` to suggest and validate scenario yaml file

2. Add config to `.vscode/settings.json` then all of files which end withs '.yas.yaml' will be suggested.

> Read more [CLI](https://github.com/doanthuanthanh88/yaml-scene#cli)

- To get `$YOUR_YAML_SCHEMA_PATH`
1. Run 
```sh
yas remove ""
```

2. Get path in your screen log   
Example: `Yaml-scene scheme is updated. "$YOUR_YAML_SCHEMA_PATH/yaml-scene.yas.json"`

```json
{
    "yaml.customTags": [
        "!tag mapping",
        "!function scalar",
    ],
    "yaml.schemas": {
        "$YOUR_YAML_SCHEMA_PATH/yaml-scene.yas.json": "*.yas.yaml"
    }
}
```
