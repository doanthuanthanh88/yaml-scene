import { Api } from ".";
import { Method } from "./Method";

export class Head extends Api {
  init(props) {
    props.method = Method.HEAD
    super.init(props)
  }
}
