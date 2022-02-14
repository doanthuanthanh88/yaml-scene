import { SingleBar } from 'cli-progress';
import { IProgressBar } from './IProgressBar';

export class ProgressBar implements IProgressBar {
  // static GetSizeName(val: number) {
  //   return ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb'][Math.floor(Math.log2(val) / 10)]
  // }

  isAutoListen: boolean
  bar: SingleBar
  isRunning = false

  constructor(title: string, opts = {
    hideCursor: true,
    clearOnComplete: true,
  }) {
    this.bar = new SingleBar(Object.assign({}, opts, {
      format: title
    }))
  }

  increment(num: number, payload?: any) {
    this.bar.increment(num, payload)
  }

  start(total: number, startValue: number, payload?: any) {
    if (!this.isRunning) {
      this.bar.start(total, startValue, payload)
      this.isRunning = true
    }
  }

  set total(total: number) {
    this.bar.setTotal(total)
  }

  get total() {
    return this.bar.getTotal()
  }

  get value() {
    return this.bar['value'] as number
  }

  set title(title: string) {
    this.bar['options'].format = title
    this.bar.render()
  }

  stop() {
    if (this.isRunning) {
      this.bar.stop()
    }
  }

}