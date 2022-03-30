import { expect, assert, should } from 'chai';
import chalk from "chalk";
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';

/**
 * @guide
 * @name Validate
 * @description Validate data in running progress  
Currently only support chai `https://www.chaijs.com`
 * @example
- Validate:
    title: Expect method
    chai: ${expect(userInfo).to.have.property('display_name')}
- Validate:
    title: Should method
    chai: ${userInfo.display_name.should.equal('thanh');}
- Validate:
    title: Assert method
    chai: ${assert.equal(userInfo.display_name, 'thanh');}
 * @end
 */
export default class Validate implements IElement {
  proxy: ElementProxy<Validate>

  title: string
  chai: string

  init(props: any) {
    merge(this, props)
  }

  async exec() {
    try {
      if (this.chai) {
        const ctx = { expect, assert } as any
        if (this.chai.includes('should.')) {
          ctx.should = should()
        }
        await this.proxy.getVar(this.chai, ctx)
      }
      this.proxy.logger.info(chalk.green('✔', this.title))
    } catch (err) {
      this.proxy.logger.error(chalk.red('✘', this.title, err.message))
      throw err
    }
  }

}