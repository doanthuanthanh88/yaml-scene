import { ElementProxy } from "@app/elements/ElementProxy";
import { IElement } from "@app/elements/IElement";
import { LogLevel } from "@app/singleton/LoggerManager";
import { Console } from "console";
import merge from "lodash.merge";
import { stdout } from "process";

/**
 * A simple extensions example
 * @description See source file
 * @alias - A Example Element
 */
export class SimpleExtension implements IElement {
  // Inherit from IElement
  proxy: ElementProxy<this>;
  // Inherit from IElement
  $$: IElement;
  // Inherit from IElement
  $: this;
  // Inherit from IElement
  logLevel?: LogLevel;

  private console: Console
  title: string
  description: string
  name: string

  /**
   * Init properties values from yaml into element
   * @function
   * @param {any} props Element properties in yaml scenario file
   */
  init(props: any): void {
    // Only passed "title", "description", "name" from yaml into element
    const { title, description, name } = props || {}
    merge(this, {
      title,
      description,
      name
    })
  }

  /**
   * Prepare data before executing
   * @function
   * @description Create objects, apply global variables...
   */
  async prepare(): Promise<void> {
    // Apply global variables to it's properties values
    this.proxy.applyVars(this, 'title', 'description', 'name')
    // Create a new console
    this.console = new Console(stdout)
  }

  /**
   * Execute main task
   */
  async exec(): Promise<any> {
    // Print "title", "description", "name" to console
    this.console.log('title', this.title)
    this.console.log('description', this.description)
    this.console.log('name', this.name)
  }

}