# Integrate with vscode

## Prerequisite
- Install platform [`yaml-scene`](https://www.npmjs.com/package/yaml-scene)
```sh
npm install -g yaml-scene           # yarn global add yaml-scene
```

## Create a task in vscode
Append the below text in `tasks.json`

```json
{
    "type": "shell",
    "label": "Yaml scene",
    "presentation": {
    "echo": true,
    "reveal": "always",
    "focus": true,
    "panel": "shared",
    "showReuseMessage": true,
    "clear": false
    },
    "command": [
    "yas",
    "${file}"
    ],
    "problemMatcher": []
}
```

## Create key bindings to quick start
1. Create a task in vscode
2. Append the below text into `keybindings.json`
    ```json
    {
        "key": "cmd+y",
        "command": "workbench.action.tasks.runTask",
        "args": "Yaml scene",
        "when": "editorTextFocus"
    }
    ```
3. After done, only open a scenario file then press `alt+y` to run

## Scenario suggestion

1. Install `redhat.vscode-yaml` to suggest and validate scenario yaml file

2. Add the bellow text to `.vscode/settings.json` then all of files which end withs '.yas.yaml' will be suggested.

    ```json
    "yaml.customTags": [
        "!function scalar",
        "!tag mapping"
    ],
    "yaml.schemas": {
        "$YOUR_YAML_SCHEMA_PATH": "*.yas.yaml"
    }
    ```

> Please replace `$YOUR_YAML_SCHEMA_PATH` to path of schema file  

**Steps to get `$YOUR_YAML_SCHEMA_PATH`:**
1. Run 
    ```sh 
        yas remove ""
    ```
2. After done, in the log screen will show the text   
`Yaml-scene scheme is updated. ".../yaml-scene.yas.json"`.  
Please copy the path to replace `$YOUR_YAML_SCHEMA_PATH` in the above configuration
