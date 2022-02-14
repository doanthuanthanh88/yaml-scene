import { Readable } from 'stream';
import { IProgressBar } from './IProgressBar';

export class ReaderProgressBar {
  private isRunning = false

  constructor(public stream: Readable, public titleCompleted: string, public bar: IProgressBar) {
    setImmediate(async () => {
      await new Promise((resolve, reject) => {
        this.stream
          .on('data', (buf: Buffer) => {
            let len = buf.byteLength || Buffer.from(buf).byteLength
            if (!this.isRunning) {
              this.isRunning = true
              this.bar.start(this.bar.total, len, {
                speed: `${len} bytes`
              })
            } else {
              this.bar.increment(len, {
                speed: `${len} bytes`
              })
            }
          })
          .on('error', (err) => {
            this.bar.stop()
            reject(err)
          })
          .on('end', () => {
            if (this.bar.total) this.bar.increment(this.bar.total - this.bar.value)
            this.bar.title = this.titleCompleted + '\n'
            this.bar.stop()
            resolve(undefined)
          })
      })
    })
  }
}