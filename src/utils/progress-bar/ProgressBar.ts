import { SingleBar } from 'cli-progress'
import { Readable, Writable } from 'stream';

export class ProgressBar {
  constructor(stream: Readable | Writable, title: string) {
    let bar: SingleBar

    stream
      .on('data', (buf: Buffer) => {
        if (!bar) {
          bar = new SingleBar({
            format: title,
            hideCursor: true,
            clearOnComplete: true,
          })
          bar.start(0, 0)
        }

        let len = buf.byteLength
        bar.increment(len, {
          speed: `${len} bytes`
        })
      })
      .on('error', () => {
        bar.stop()
      })
      .on('end', () => {
        bar.stop()
      })

  }

}