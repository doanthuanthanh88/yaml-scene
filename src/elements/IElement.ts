import { LogLevel } from "@app/singleton/LoggerManager";
import { ElementProxy } from "./ElementProxy";

// Describe functions and properties which a element must have
export interface IElement {
  // Wrapper for this element. It provides utility functions
  proxy: ElementProxy<this>
  // This ref to parent Group element
  $$: IElement

  // This ref to this
  $: this

  // Pick a logger to print log
  logLevel?: LogLevel

  // Conditional
  if?: any
  // Sleep for a time before keep playing
  delay?: any
  // This element will be executed asynchronized
  async?: any
  // Loop this element
  loop?: any
  // Loop key. Depends loop
  loopKey?: any
  // Loop value. Depends loop
  loopValue?: any

  /**
   * Init data value from yaml to the element. Only handle raw data
   * @param {any} props Element attribute which is passed from scenario yaml file
   */
  init?(props: any): void

  /**
   * Create and prepare data for element.
   */
  prepare?(): Promise<void> | void

  /**
   * Element execute main tasks
   */
  exec?(): Promise<any> | any

  /**
   * Release resources after executed successfully
   */
  dispose?(): Promise<void> | void

  /**
   * Clone data when it is in the loop or get in templates
   */
  clone?(): this
}
