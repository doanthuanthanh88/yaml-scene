import Api from ".";
import { Method } from "./Method";

/**
 * @guide
 * @name Api/Options
 * @description Send a Options request via http
 * @group Api
 * @order 5
 * @example
- Api/Options:
    title: Test CORs a product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
 * @end
 */
export default class Options extends Api {
  init(props) {
    props.method = Method.OPTIONS
    super.init(props)
  }
}
