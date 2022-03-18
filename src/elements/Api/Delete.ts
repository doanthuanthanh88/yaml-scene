import Api from ".";
import { Method } from "./Method";

/**
 * Api/Delete
 * @description Send a DELETE request via http
 * @group Api
 * @order 4
 * @example
- Api/Delete:
    title: Delete a product                                     # Api name
    description: It's only serve content for admin              # Api description
    doc: true                                                   # Push it to queue to export to doc in element `Doc/Api/MD`
    baseURL: http://localhost:3000                              
    url: /product/:id
    params:                                                     # Request params. (In the example, url is "/product/1")
      id: 1
    query:                                                      # Request querystring (In the example, url is appended "?order=name")
      order: name
    headers:                                                    # Request headers
      authorization: ...
    timeout: 1s                                                 # Request timeout
    validate:                                                   # Validate response after request done. (Reference to #Validate)
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
 */
export default class Delete extends Api {
  init(props) {
    props.method = Method.DELETE
    super.init(props)
  }
}
