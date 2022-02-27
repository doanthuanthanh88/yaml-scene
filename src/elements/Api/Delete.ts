import { Api } from ".";
import { Method } from "./Method";

/**
 * Delete
 * @description Send a DELETE request via http
 * @group Api
 * @order 5
 * @example
- Delete:
    title: Delete a product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
 */
export class Delete extends Api {
  init(props) {
    props.method = Method.DELETE
    super.init(props)
  }
}
