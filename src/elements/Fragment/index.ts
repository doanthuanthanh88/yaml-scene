import { Scenario } from "@app/singleton/Scenario";
import { TraceError } from "@app/utils/error/TraceError";
import { FileUtils } from "@app/utils/FileUtils";
import merge from 'lodash.merge';
import Group from "../Group";

/**
 * @guide
 * @name Fragment
 * @description Import a scenario file (URL or file local) in the scenario.
 * @example
- Fragment: http://raw.github.../scenario1.yas.yaml

- Fragment: 
    title: Load from another file
    file: ./scenario1.yas.yaml
    password: $PASS_TO_DECRYPT
 * @end
 */
export default class Fragment extends Group {
  file: string
  password?: string

  override init(props: { file: string, password: string } | string) {
    if (typeof props === 'string') {
      this.file = props
    } else {
      merge(this, props)
    }
  }

  override async prepare() {
    await this.proxy.applyVars(this, 'title', 'description', 'file')
    this.file = this.proxy.resolvePath(this.file)
    if (!FileUtils.Existed(this.file)) {
      throw new TraceError(`Scenario file "${this.file}" is not found`)
    }
    const { vars, title, description, steps } = await Scenario.Instance.getScenarioFile(this.file, this.password)
    if (vars) {
      steps?.splice(0, 0, {
        Vars: vars
      })
    }
    super.init({
      title: this.title || title,
      description: this.description || description,
      steps,
    })
    return super.prepare()
  }

}