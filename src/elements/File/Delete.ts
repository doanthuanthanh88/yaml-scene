import { Scenario } from '@app/singleton/Scenario';
import { FileUtils } from '@app/utils/FileUtils';
import { LazyImport } from '@app/utils/LazyImport';
import chalk from 'chalk';
import merge from 'lodash.merge';
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';

/*****
@name File/Delete
@description Delete files or directories
@group File
@example
- File/Delete:
    title: Write to a json file
    paths:
      - /tmp/db.json
      - /tmp/caches
      - /tmp/caches/.*?\.tmp
@example
- File/Delete:
    - /tmp/db.json
    - /tmp/caches
    - /tmp/caches/*.tmp
    - /tmp/**\/*.tmp
@example
- File/Delete: /tmp/db.json
*/
export default class Writer implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  title?: string
  paths: string[]

  init(props: any) {
    if (Array.isArray(props)) {
      this.paths = props
    } else if (typeof props === 'string') {
      this.paths = [props]
    } else {
      merge(this, props)
    }
    this.paths = this.paths.map(e => e.trim()).filter(path => !!path)
  }

  async prepare() {
    await this.proxy.applyVars(this, 'title', 'paths')
  }

  async exec() {
    if (this.title) this.proxy.logger.info('%s', this.title)
    this.title && console.group()
    try {
      for (const path of this.paths) {
        this.proxy.logger.debug(chalk.gray(`- Deleting "${path}"`))
        if (FileUtils.Existed(path) === true) {
          FileUtils.RemoveFilesDirs(path)
        } else {
          const glob = await LazyImport(import('glob'))
          const paths = glob.sync(path, { cwd: Scenario.Instance.element.rootDir })
          paths.forEach(path => FileUtils.RemoveFilesDirs(path))
        }
      }
    } finally {
      this.title && console.groupEnd()
    }
  }

}