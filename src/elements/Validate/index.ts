import { expect } from 'chai'
import chalk from "chalk"
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy'

/**
 * Validate
 * @description Validate data in running progress  
 * Currently only support chai `https://www.chaijs.com`
 * @example
- Validate:
    title: Validate number
    chai: ${expect(10).to.equal(200)}
- Validate:
    title: Test response
    chai: ${expect(userInfo).to.have.property('display_name')}
 */
export default class Validate {
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
      this.proxy.logger.info(chalk.green('✔', this.title))
    } catch (err) {
      this.proxy.logger.error(chalk.red('✘', this.title, err.message))
      throw err
    }
  }

}