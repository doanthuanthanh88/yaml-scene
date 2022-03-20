import { ElementProxy } from "./ElementProxy";

export interface IElement {
  // Proxy object which provides some utils functions (logger...)
  proxy?: ElementProxy<any>

  // Init attribute from yaml to object
  init?(props: any): void
  // Prepare data, replace data value before executing
  prepare?(): Promise<void> | void
  // Execute main flow
  exec?(): Promise<any> | any
  // After executed done need dispose object
  dispose?(): Promise<void> | void
  // Clone new object in loop or template...
  clone?(): any
}
