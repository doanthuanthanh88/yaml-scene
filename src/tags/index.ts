import { DEFAULT_SCHEMA } from "js-yaml";
import { FragmentScalar } from "./fragment";
import { FunctionScalar } from "./function";
import { BinaryScalar } from "./upload";

export class YAMLSchema {
  static readonly Schema = DEFAULT_SCHEMA.extend([
    new BinaryScalar(),
    new FragmentScalar(),
    new FunctionScalar(),
  ])
}
