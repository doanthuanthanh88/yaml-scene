import chalk from "chalk"
import { merge } from "lodash"
import { ElementProxy } from "../ElementProxy"

/**
 * Api~summary
 * @description Summary after all of apis in scene executed done.
 * @group Api
 * @example
- Api~summary:
    title: Testing result
 */
export class Summary {
  proxy: ElementProxy<Summary>

  title: string

  private passed = 0
  private failed = 0
  get total() {
    return this.passed + this.failed
  }

  init(props: string) {
    if (props && typeof props !== 'object') {
      this.title = props
    } else {
      merge(this, props)
    }
    this.proxy.scenario.events
      .on('api.done', isPassed => {
        if (isPassed) {
          this.passed++
        } else {
          this.failed++
        }
      }).once('scenario.dispose', () => {
        this.proxy.logger.info('---------------------------------')
        console.group()
        this.proxy.logger.info('%s %s', chalk.cyan.bold(this.title), chalk.gray(`${this.proxy.scenario.time.dispose - this.proxy.scenario.time.begin}ms`))
        this.proxy.logger.info(chalk.green('- Passed %d/%d'), this.passed, this.total)
        this.proxy.logger.info(chalk.red('- Failed %d/%d'), this.failed, this.total)
        console.groupEnd()
        this.proxy.logger.info('---------------------------------')
      })
  }

  exec() {

  }
}
