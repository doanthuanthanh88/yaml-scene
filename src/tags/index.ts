import { Scenario } from "@app/singleton/Scenario";
import { Schema } from "js-yaml";
import { FragmentScalar } from "./fragment";
import { FunctionScalar } from "./function";
import { BinaryScalar } from "./upload";

export class YAMLSchema {
  static Create(scenario: Scenario) {
    return Schema.create([
      new BinaryScalar(scenario),
      new FragmentScalar(scenario),
      new FunctionScalar(scenario),
    ])
  }
}
