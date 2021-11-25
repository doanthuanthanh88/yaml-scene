import { Api } from ".";
import { Method } from "./Method";

export class Put extends Api {
  init(props) {
    props.method = Method.PUT
    super.init(props)
  }
}
