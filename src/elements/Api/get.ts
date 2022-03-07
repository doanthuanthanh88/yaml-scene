import { Api } from ".";
import { Method } from "./Method";

/**
 * Api~get
 * @description Send a GET request via http
 * @group Api
 * @order 4
 * @example
- Api~get:
    title: Get product details
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
 */
export class get extends Api {
  init(props) {
    props.method = Method.GET
    super.init(props)
  }
}
