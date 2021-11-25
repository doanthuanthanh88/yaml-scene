import { Schema } from "js-yaml";
import { fragment } from "./fragment";
import { binary } from "./upload";

export const SCHEMA = Schema.create([
  binary,
  fragment
])
