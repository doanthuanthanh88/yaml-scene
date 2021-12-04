import { SingleBar } from 'cli-progress';
import { IProgressBar } from './IProgressBar';

export class ProgressBar implements IProgressBar {
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
    }
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