import { LogLevel } from "@app/singleton/LoggerManager";
import { ElementProxy } from "./ElementProxy";

/**
 * Describe functions and properties which a element must have
 * @interface
 */
export interface IElement {
  /**
   * Wrapper for this element. It provides utility functions
   * @implements
   * @type {Object.ElementProxy<this>}
   */
  proxy: ElementProxy<this>

  /**
   * This ref to parent Group element
   * @type {IElement}
   */
  $$: IElement

  /**
   * This ref to this
   * @type {this}
   */
  $: this

  /**
   * Pick a logger to print log
   * @type {LogLevel}
   */
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
   * @async
   */
  prepare?(): Promise<void> | void

  /**
   * Element execute main tasks
   * @async
   */
  exec?(): Promise<any> | any

  /**
   * Release resources after executed successfully
   * @async
   */
  dispose?(): Promise<void> | void

  /**
   * Clone data when it is in the loop or get in templates
   * @async
   * @returns Instance of this element
   * @default undefined
   */
  clone?(): this
}
