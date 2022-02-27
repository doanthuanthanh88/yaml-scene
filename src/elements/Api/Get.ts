import { Api } from ".";
import { Method } from "./Method";

/**
 * Get
 * @description Send a GET request via http
 * @group Api
 * @order 4
 * @example
- Get:
    title: Get product details
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
 */
export class Get extends Api {
  init(props) {
    props.method = Method.GET
    super.init(props)
  }
}
