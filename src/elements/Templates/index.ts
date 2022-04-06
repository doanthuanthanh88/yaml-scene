import Group from "../Group";

/**
 * @guide
 * @name Templates
 * @description Declare elements which not `inited` or `run`  
It's only used for `extends` or `inherit` purposes
 * @example
- Templates:
    - Get:
        ->: base1    # Declare a template with name is "base"
        baseURL: http://localhost:3001

- Templates:
    base2: # Declare a template with name is "base"
      Get:
        baseURL: http://localhost:3000

- Get:
    <-: base1        # Extends "base1" in template then add more information or overrided them before executing
    url: /product/:id
    params:
      id: 1

- Get:
    <-: base2        # Extends "base2" in template then add more information or overrided them before executing
    url: /product/:id
    params:
      id: 2
 * @end
 */
export default class Templates extends Group {

  override init(items = [] as { [name: string]: any } | any[]) {
    const templates = Array.isArray(items) ? items : Object.keys(items).map(templateName => {
      const elementName = Object.keys(items[templateName])[0]
      items[templateName][elementName]['->'] = templateName
      return items[templateName]
    })
    super.init({
      steps: templates
    })
    this.initStep()
  }

  override async prepare() { }

  override async exec() { }

  clone() {
    return this
  }

}