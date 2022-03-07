import { Api } from ".";
import { Method } from "./Method";

/**
 * Api~head
 * @description Send a Head request via http
 * @group Api
 * @order 6
 * @example
- Api~head:
    title: Ping a product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
 */
export class head extends Api {
  init(props) {
    props.method = Method.HEAD
    super.init(props)
  }
}
