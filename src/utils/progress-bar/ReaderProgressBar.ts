import { Readable, Writable } from 'stream';
import { IProgressBar } from './IProgressBar';

export class ReaderProgressBar {
  private isRunning = false

  constructor(stream: Readable | Writable, titleCompleted: string, public bar: IProgressBar) {
    stream
      .on('data', (buf: Buffer) => {
        if (!this.isRunning) {
          this.isRunning = true
          this.bar.start(0, 0)
        }
        let len = buf.byteLength
        bar.increment(len, {
          speed: `${len} bytes`
        })
      })
      .on('error', () => {
        this.bar.stop()
      })
      .on('end', () => {
        this.bar.title = titleCompleted + '\n'
        this.bar.stop()
      })
  }

}