import { Functional } from '@app/tags/model/Functional';
import { assert, expect, should } from 'chai';
import chalk from "chalk";
import merge from "lodash.merge";
import { ElementProxy } from '../ElementProxy';
import { IElement } from '../IElement';

/*****
@name Validate
@description Validate data in running progress  
Currently only support chai `https://www.chaijs.com`
@example
- Validate:
    title: Expect method
    chai: ${expect(userInfo).to.have.property('display_name')}
@example
- Validate:
    title: Should method
    chai: ${userInfo.display_name.should.equal('thanh');}
@example
- Validate:
    title: Assert method
    chai: ${assert.equal(userInfo.display_name, 'thanh');}
@example
- Validate:
    title: Assert method          # Not define "chai" then it auto passes
@example
- Vars:
    age: 10
- Validate:
    title: Customize validate by code
    chai: !function |
      ({ age, assert, expect, should }) {                           # "assert", "expect", "should" are chaijs functions
        if (age <= 10) assert.fail('Age must be greater than 10')   # "this" is referenced to Validate element
      }
*/
export default class Validate implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  title?: string
  chai?: string | Functional

  init(props: any) {
    merge(this, props)
  }

  async prepare() {
    await this.proxy.applyVars(this, 'title')
  }

  async exec() {
    try {
      if (this.chai) {
        if (this.chai instanceof Functional) {
          const func = this.chai.getFunctionFromBody()
          await this.proxy.call(func, { expect, assert, should: should() }, this.$)
          await func.call(this.$,)
        } else {
          await this.proxy.getVar(this.chai, { expect, assert, should: should() })
        }
      }
      this.proxy.logger.info(chalk.green('✔', this.title))
    } catch (err: any) {
      this.proxy.logger.error(chalk.red('✘', this.title, err?.message))
      throw err
    }
  }

}