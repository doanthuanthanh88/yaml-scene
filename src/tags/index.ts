import { Schema } from "js-yaml";
import { FragmentScalar } from "./fragment";
import { FunctionScalar } from "./function";
import { BinaryScalar } from "./upload";

export class YAMLSchema {
  static readonly Schema = Schema.create([
    new BinaryScalar(),
    new FragmentScalar(),
    new FunctionScalar(),
  ])
}
