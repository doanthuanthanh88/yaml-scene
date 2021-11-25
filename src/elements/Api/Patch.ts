import { Api } from ".";
import { Method } from "./Method";

export class Patch extends Api {
  init(props) {
    props.method = Method.PATCH
    super.init(props)
  }
}
