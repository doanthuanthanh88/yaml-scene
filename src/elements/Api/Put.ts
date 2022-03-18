import { Api } from ".";
import { Method } from "./Method";

/**
 * Api~Put
 * @description Send a Put request via http
 * @group Api
 * @order 4
 * @example
- Api~Put:
    title: Update a product                                     # Api name
    description: It's only serve content for admin              # Api description
    doc: true                                                   # Push it to queue to export to doc in element `Doc~ApiMD`
    baseURL: http://localhost:3000                              
    url: /product/:id
    params:                                                     # Request params. (In the example, url is "/product/1")
      id: 1
    query:                                                      # Request querystring (In the example, url is appended "?order=name")
      order: name
    headers:                                                    # Request headers
      authorization: ...
    body: {                                                     # Request body which used in [POST, PUT, PATCH...] methods
      name: "thanh",
      file: !binary ./my_file.txt                               # Use !binary to upload a file to server (content-type: multipart/form-data)
    }
    timeout: 1s                                                 # Request timeout
    validate:                                                   # Validate response after request done. (Reference to #Validate)
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
 */
export class Put extends Api {
  init(props) {
    props.method = Method.PUT
    super.init(props)
  }
}
