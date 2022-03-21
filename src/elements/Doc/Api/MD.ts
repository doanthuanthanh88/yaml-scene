import Api from "@app/elements/Api"
import { File } from "@app/elements/File/adapter/File"
import { TimeUtils } from "@app/utils/time"
import merge from "lodash.merge"
import { ElementProxy } from "../../ElementProxy"
import { Exporter } from "./Exporter"

/**
 * @guide
 * @name Doc/Api/MD
 * @description Document api to markdown format
 * @group Doc, Api
 * @example
- Doc/Api/MD:
    title: Post service
    description: Demo CRUD API to generate to markdown document
    signature: "[Doan Thuan Thanh](mailto:doanthuanthanh88@gmail.com)"
    outFile: ./api_document_details.md
 * @end
 */
export default class ApiMD {
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
        if (isPassed && !!api.doc) {
          this.apis.push(api)
        }
      })
  }

  prepare() {
    this.outFile = this.proxy.resolvePath(this.outFile)
  }

  async exec() {
    // Wait 2s to make sure the lastest api event "api.done" fired
    await TimeUtils.Delay('2s')

    const exporter = new Exporter(new File(this.outFile), this)
    exporter.export(this.apis.sort((a, b) => a.title > b.title ? 1 : -1))
    this.proxy.logger.info(`Document is generated at ${this.outFile}`)
  }

}
