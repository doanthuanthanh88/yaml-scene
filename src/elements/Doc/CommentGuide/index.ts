import { ElementProxy } from "@app/elements/ElementProxy";
import { IElement } from "@app/elements/IElement";
import { FileDataSource } from '@app/utils/data-source/file/FileDataSource';
import { merge } from "lodash";
import { CommentExporter } from './CommentExporter';
import { CommentInfo } from './CommentInfo';
import { CommentParser } from './CommentParser';
import { CommentScanner } from './CommentScanner';

/**
 * Doc#CommentGuide
 * @group Doc
 * @description Auto scan file to detect the comment format which is generated to markdown document
 * @example
- CommentGuide: 
    includes: 
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
 */
export class CommentGuide implements IElement {
  proxy: ElementProxy<any>

  includes?: string[]
  excludes?: string[]
  includePattern?: RegExp
  outFile: string

  init(props: any) {
    if (!props.outFile) throw new Error(`"outFile" is required in ${this.constructor.name}`)
    merge(this, props)
  }

  prepare() {
    if (!this.includes) this.includes = []
    if (!this.excludes) this.excludes = []
    if (this.includePattern) this.includePattern = new RegExp(this.includePattern.toString())
    this.includes = this.includes.map(p => this.proxy.resolvePath(p))
    this.excludes = this.excludes.map(p => this.proxy.resolvePath(p))
    this.outFile = this.proxy.resolvePath(this.outFile)
  }

  async exec() {
    this.proxy.logger.info('Scanning document...')
    const scanner = new CommentScanner(new CommentExporter(new FileDataSource(this.outFile)), CommentParser)
    scanner.event.on('scanfile', path => this.proxy.logger.debug('-', path))
    const commentModels = new Array<CommentInfo>()
    await Promise.all(
      this.includes.map(async (inputPath: string) => {
        const commentParsers = await scanner.scanDir(inputPath, this.excludes, this.includePattern) as CommentParser[]
        const commentsModels = await Promise.all(
          commentParsers.map(parser => parser.parse())
        )
        commentModels.push(...commentsModels.flat())
      })
    )
    await scanner.exporter.export(commentModels)
    this.proxy.logger.info(`Document is generated at ${this.outFile}`)
  }

}