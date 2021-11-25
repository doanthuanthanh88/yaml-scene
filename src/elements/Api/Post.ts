import { Api } from ".";
import { Method } from "./Method";

export class Post extends Api {
  init(props) {
    props.method = Method.POST
    super.init(props)
  }
}
