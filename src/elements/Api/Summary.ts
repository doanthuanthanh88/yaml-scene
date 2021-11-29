import chalk from "chalk"
import { merge } from "lodash"
import { ElementProxy } from "../ElementProxy"

export class Summary {
  proxy: ElementProxy<Summary>

  title: string

  private passed = 0
  private failed = 0
  private time = 0
  get total() {
    return this.passed + this.failed
  }

  init(props: string) {
    if (props && typeof props !== 'object') {
      this.title = props
    } else {
      merge(this, props)
    }
  }

  exec() {
    this.time = Date.now()
    this.proxy.tc.events
      .on('Api.done', isPassed => {
        if (isPassed) {
          this.passed++
        } else {
          this.failed++
        }
      }).once('TestCase.dispose', () => {
        this.time = Date.now() - this.time
        this.proxy.logger.info('---------------------------------')
        console.group()
        this.proxy.logger.info('%s %s', chalk.cyan.bold(this.title), chalk.gray(`${this.time}ms`))
        this.proxy.logger.info(chalk.green('- Passed %d/%d'), this.passed, this.total)
        this.proxy.logger.info(chalk.red('- Failed %d/%d'), this.failed, this.total)
        console.groupEnd()
        this.proxy.logger.info('---------------------------------')
      })
  }
}
