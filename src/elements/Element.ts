// import { ElementProxy } from "./ElementProxy";

export interface Element {
  // proxy: ElementProxy<any>

  init(props: any)
  prepare()
  exec()
  dispose()
  clone()
}
