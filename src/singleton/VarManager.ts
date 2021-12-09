import { Variable } from "@app/utils/core/Variable"
import { Base64 } from "@app/utils/encrypt/Base64"
import chalk from "chalk"

export class VarManager {
  private static _Instance: Variable

  static get Instance() {
    return VarManager._Instance || (VarManager._Instance = new Variable({
      get $$base64() {
        return Base64.GetInstance()
      },
      get $$color() {
        return chalk
      }
    }))
  }
}
