/*****
@name Standard Scenario file
@h1
@order 1
@description A standard scenario file
@example
title: Scene name                                   # Scene name
description: Scene description                      # Scene description
password:                                           # File will be encrypted to $FILE_NAME.encrypt to share to someone run it for privacy
logLevel: debug                                     # How to show log is debug)
                                                    # - slient: Dont show anything
                                                    # - error: Show error log
                                                    # - warn: Show warning log
                                                    # - info: Show infor, error log
                                                    # - debug: Show log details, infor, error log ( Default )
                                                    # - trace: Show all of log
install:                                            # Install extensions from npm registry
  local:                                            # Install extensions to local path (npm install --prefix $path/node_modules)
    path: ./                                        # There are some type of path
                                                    # - ./test/:  Relative path from folder which includes a scenario file
                                                    # - test/:    Relative path from folder which includes a scenario file
                                                    # - ~/test:   Relative path from user home directory
                                                    # - #/test:   Relative path from yaml-scene/src
                                                    # - /test:    Absolute path
    dependencies:
      - lodash
  global:                                           # Install extension to global (npm install -g)
    dependencies:
      - axios

extensions:                                         # Extension elements.
  extension_name1: ./cuz_extensions/custom1.js      # - Load a element in a file with exports.default (extension_name1:)
  extensions_folders: ./cuz_extensions              # - Load elements in files in the folder with file name is element name (extensions_folders/custom1:)
vars:                                               # Declare global variables, which can be replaced by env
  url: http://localhost:3000                        # env URL=
  token: ...                                        # env TOKEN=
  user:
    id_test: 1                                      # env USER_ID_TEST=
stepDelay: 1s                                       # Each of steps will delay 1s before play the next
steps:                                              # Includes all which you want to do (URL or file local)
  - Fragment ./scene1.yas.yaml
  - Fragment ./scene2.yas.yaml
  - extension_name1:
  - extensions_folders/custom1:
  - Script/Js: |
      require('lodash').merge({}, {})
  - yas-sequence-diagram~SequenceDiagram:           # Load yas-sequence-diagram from npm/yarn global dirs then use class SequenceDiagram to handle
*/
/*****
@name Simple Scenario file
@h1
@order 2
@description Load then run a simple scenario file
@example
- Fragment ./scene1.yas.yaml                        # Includes all which you want to do (URL or file local)
- Fragment ./scene2.yas.yaml
*/

export enum ScenarioEvent {
  /**
   * When replay scenario
   */
  RESET = 'scenario.reset',
  /**
   * Init scenario
   */
  INIT = 'scenario.init',
  /**
   * Prepare and load value to scenario variables
   */
  PREPARE = 'scenario.prepare',
  /**
   * Execute the scenario
   */
  EXEC = 'scenario.exec',
  /**
   * Begin to dispose the scenario
   */
  DISPOSE = 'scenario.dispose',
  /**
   * After disposed the scenario successfully
   */
  END = 'scenario.end'
}
