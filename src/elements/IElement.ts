import { ElementProxy } from "./ElementProxy";

export interface IElement {
  // Proxy object which provides some utils functions (logger...)
  proxy?: ElementProxy<any>
  async?: boolean
  delay?: number

  // Init attribute from yaml to object
  init?(props: any)
  // Prepare data, replace data value before executing
  prepare?()
  // Execute main flow
  exec?()
  // After executed done need dispose object
  dispose?()
  // Clone new object in loop or template...
  clone?()
}
