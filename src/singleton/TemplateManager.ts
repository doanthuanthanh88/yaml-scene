import { IElement } from "@app/elements/IElement"
import { TraceError } from "@app/utils/error/TraceError"
import cloneDeep from "lodash.clonedeep"
import omit from "lodash.omit"
import { Scenario } from "./Scenario"
import { ScenarioEvent } from "./ScenarioEvent"

export class TemplateManager extends Map<string, IElement> {
  private static _Instance: TemplateManager

  static get Instance() {
    if (!this._Instance) {
      Scenario.Instance.events.once(ScenarioEvent.RESET, () => {
        this._Instance = undefined
      })
      this._Instance = new TemplateManager()
    }
    return this._Instance
  }

  setElement(name: string, elem: IElement) {
    const newOne = elem.clone ? elem.clone() : cloneDeep(elem)
    return this.set(name, omit(newOne, 'proxy', '$', '$$') as IElement)
  }

  getElement(name: string) {
    const elem = super.get(name)
    if (elem) return elem.clone ? elem.clone() : cloneDeep(elem)
    throw new TraceError(`Could not found template "${name}"`)
  }

}