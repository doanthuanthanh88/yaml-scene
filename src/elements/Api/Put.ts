import { Api } from ".";
import { Method } from "./Method";

/**
 * Put
 * @description Send a Put request via http
 * @group Api
 * @order 3
 * @example
- Put:
    title: Update product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: ${newProduct.id}
    body:
      name: updated name
      quantity: 11
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
    var: updatedProduct
 */
export class Put extends Api {
  init(props) {
    props.method = Method.PUT
    super.init(props)
  }
}
