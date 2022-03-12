import { Api } from "@app/elements/Api"
import { FileDataSource } from "@app/utils/data-source/file/FileDataSource"
import { TimeUtils } from "@app/utils/time"
import { merge } from "lodash"
import { ElementProxy } from "../../ElementProxy"
import { Exporter } from "./Exporter"

/**
 * Doc~ApiMD
 * @description Document api to markdown format
 * @group Doc
 * @example
- Doc~ApiMD:
    title: Post service
    description: Demo CRUD API to generate to markdown document
    signature: "[Doan Thuan Thanh](mailto:doanthuanthanh88@gmail.com)"
    outFile: ./api_document_details.md
 */
export class ApiMD {
  proxy: ElementProxy<ApiMD>
  apis: Api[]

  title: string
  description: string
  signature: string

  outFile: string

  constructor() {
    this.apis = new Array()
  }

  init(props: any) {
    if (!props.outFile) throw new Error(`"outFile" is required in ${this.constructor.name}`)
    merge(this, props)
    this.proxy.scenario.events
      .on('api.done', (isPassed: boolean, api) => {
        if (isPassed) {
          this.apis.push(api)
        }
      })
  }

  prepare() {
    this.outFile = this.proxy.resolvePath(this.outFile)
  }

  async exec() {
    await TimeUtils.Delay('1s')
    const exporter = new Exporter(new FileDataSource(this.outFile), this)
    exporter.export(this.apis)
    this.proxy.logger.info(`Document is generated at ${this.outFile}`)
  }

}
