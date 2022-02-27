import { Api } from ".";
import { Method } from "./Method";

/**
 * Patch
 * @description Send a Patch request via http
 * @group Api
 * @order 2
 * @example
- Patch:
    title: Update product name
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    body:
      name: updated name
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
 */
export class Patch extends Api {
  init(props) {
    props.method = Method.PATCH
    super.init(props)
  }
}
