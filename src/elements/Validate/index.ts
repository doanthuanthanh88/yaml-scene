import { assert, expect, should } from 'chai';
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
- Validate:
    title: Assert method          # Not define "chai" then it auto passes
 * @end
 */
export default class Validate implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  title?: string
  chai?: string

  init(props: any) {
    merge(this, props)
  }

  async prepare() {
    await this.proxy.applyVars(this, 'title')
  }

  async exec() {
    try {
      if (this.chai) {
        const ctx = {} as any
        if (this.chai.includes('expect(')) {
          ctx.expect = expect
        }
        if (this.chai.includes('assert(')) {
          ctx.assert = assert
        }
        if (this.chai.includes('should.')) {
          ctx.should = should()
        }
        await this.proxy.getVar(this.chai, ctx)
      }
      this.proxy.logger.info(chalk.green('✔', this.title))
    } catch (err: any) {
      this.proxy.logger.error(chalk.red('✘', this.title, err?.message))
      throw err
    }
  }

}