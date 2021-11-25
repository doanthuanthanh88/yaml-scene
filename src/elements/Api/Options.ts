import { Api } from ".";
import { Method } from "./Method";

export class Options extends Api {
  init(props) {
    props.method = Method.OPTIONS
    super.init(props)
  }
}
