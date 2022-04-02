import { DEFAULT_SCHEMA } from "js-yaml";
import { FunctionScalar } from "./function";
import { TagMapping } from "./tag";

export class YAMLSchema {
  static readonly Schema = DEFAULT_SCHEMA.extend([
    new FunctionScalar(),
    new TagMapping(),
  ])
}
