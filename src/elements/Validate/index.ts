import { expect } from 'chai'
import chalk from "chalk"
import { merge } from 'lodash'
import { ElementProxy } from '../ElementProxy'

export class Validate {
  proxy: ElementProxy<Validate>

  title: string
  chai: string

  init(props: any) {
    merge(this, props)
  }

  exec() {
    try {
      if (this.chai) {
        this.proxy.getVar(this.chai, { expect })
      }
      console.log(chalk.green('✔', this.title))
    } catch (err) {
      console.error(chalk.red('✘', this.title, err.message))
      throw err
    }
  }

}