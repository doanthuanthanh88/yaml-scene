import { Api } from ".";
import { Method } from "./Method";

/**
 * Api~post
 * @description Send a Post request via http
 * @group Api
 * @order 1
 * @example
- Api~post:
    title: Create a new product
    doc: true
    baseURL: http://localhost:3000
    url: /product
    body:
      name: updated name
      quantity: 10
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
    var: newProduct
 */
export class Post extends Api {
  init(props) {
    props.method = Method.POST
    super.init(props)
  }
}
