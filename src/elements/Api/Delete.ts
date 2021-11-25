import { Api } from ".";
import { Method } from "./Method";

export class Delete extends Api {
  init(props) {
    props.method = Method.DELETE
    super.init(props)
  }
}
