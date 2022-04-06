import { ElementProxy } from "@app/elements/ElementProxy";
import { File } from "@app/elements/File/adapter/File";
import { IElement } from "@app/elements/IElement";
import { TraceError } from "@app/utils/error/TraceError";
import merge from "lodash.merge";
import { Scanner } from '../Scanner';
import { CommentExporter } from './CommentExporter';
import { CommentInfo } from './CommentInfo';
import { CommentParser } from './CommentParser';

/**
 * @guide
 * @name Doc/Guide/MD
 * @group Doc
 * @description Auto scan file to detect the comment format which is generated to markdown document
 * @exampleType custom
 * @example
```yaml
- Doc/Guide/MD: 
    # pattern:
    #   begin: ^\s*\*\s@guide\\s*$         # Default pattern
    #   end: \s*\*\s@end\\s*$              # Default pattern
    prefixHashLink:                        # Default is `user-content-` for github
    includes: 
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
```

** Code example **

```js
/**
 * @guide
 * @name Element1
 * @description Embed javascript code into scene
***Details***

 * @h1 ##
Could not combine `@h1` and `@h2` in same guideline block
More information above detail block

 * @h2 ##
Could not combine `@h1` and `@h2` in same guideline block
More information below detail block

 * @group Tag1, Tag2
 * @exampleType custom
 * @example
**Example**  
```js
console.log('Hello world')
``\`
 \* @end
 *\/
class Element1 {

}
```
- `@guide`: Begin scan a new guideline block
- `@name`: Element name
- `@description`: Element description. (Markdown format)
- `@exampleType`: This is content type in hightlight code block in markdown. \`\`\`yaml ... \`\`\`
  - Default is `yaml`
  - If the value is `custom` then content in example will be used as markdown format. (Not hightlight code block)
- `@example`: Some examples for this element. 
  - Content type depends on `@exampleType`
    - Default is `yaml`.
    - If `@exampleType` is `custom` then this will used as markdown format
    - Otherwise, it used hightlight code block \`\`\` ... \`\`\` in markdown
- `@group`: Group this element. 
  - Separate by `, `. 
  - Example: `Tag 1, Tag 2`
- `@order`: Priority position display this element in a same group
  - Example: 1. 
  - Default: 5
- `@h1`: Describe header in markdown (#, ##...). This content is markdown format which show above document details block. Could not combine `@h1` and `@h2` in same guideline block
- `@h2`: Describe header in markdown (#, ##...). This content is markdown format which show below document details block. Could not combine `@h1` and `@h2` in same guideline block
- `@end`: Mark to scan done a guideline block

**Header position**

```js
-----------------------MENU------------------------
Menu name which not be set `@h1` or `@h2`.
Menu will be grouped by `@group` and show as table
------------------------H1-------------------------
List `@h1` content
----------------------DETAILS----------------------
List content which not includes `@h1` and `@h2`
------------------------H2-------------------------
List `@h2` content
---------------------------------------------------
```

> This guideline is generated by this

 * @end
 */
export default class GuideMD implements IElement {
  proxy: ElementProxy<this>
  $$: IElement
  $: this

  includes: string[]
  excludes?: string[]
  pattern?: {
    begin: string
    end: string
  }
  includePattern?: RegExp
  outFile: string
  prefixHashLink: string

  init(props: any) {
    if (!props.outFile) throw new TraceError(`"outFile" is required in ${this.constructor.name}`)
    merge(this, props)
  }

  async prepare() {
    await this.proxy.applyVars(this, 'includes', 'excludes', 'pattern', 'includePattern', 'outFile', 'prefixHashLink')
    if (!this.prefixHashLink) this.prefixHashLink = 'user-content-'
    if (!this.includes) this.includes = []
    if (!this.excludes) this.excludes = []
    if (this.includePattern) this.includePattern = new RegExp(this.includePattern.toString())
    this.includes = this.includes.map(p => this.proxy.resolvePath(p))
    this.excludes = this.excludes.map(p => this.proxy.resolvePath(p))
    this.outFile = this.proxy.resolvePath(this.outFile)
  }

  async exec() {
    this.proxy.logger.info('Scanning document...')
    const scanner = new Scanner(new CommentExporter(new File(this.outFile), this.prefixHashLink), CommentParser)
    scanner.event.on('scanfile', path => this.proxy.logger.debug('-', path))
    const commentModels = new Array<CommentInfo>()
    await Promise.all(
      this.includes.map(async (inputPath: string) => {
        const commentParsers = await scanner.scanDir(inputPath, this.excludes, this.includePattern, this.pattern?.begin, this.pattern?.end) as CommentParser[]
        const commentsModels = await Promise.all(
          commentParsers.map(parser => parser.parse())
        )
        commentModels.push(...commentsModels.flat())
      })
    )
    await scanner.exporter.export(commentModels)
    this.proxy.logger.info(`Document is generated at ${this.outFile} `)
  }

}