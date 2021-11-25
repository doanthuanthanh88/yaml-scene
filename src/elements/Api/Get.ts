import { Api } from ".";
import { Method } from "./Method";

export class Get extends Api {
  init(props) {
    props.method = Method.GET
    super.init(props)
  }
}
