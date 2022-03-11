# Document
## Api
* Post: *Send a Post request via http*
* Patch: *Send a Patch request via http*
* Put: *Send a Put request via http*
* Get: *Send a GET request via http*
* Delete: *Send a DELETE request via http*
* Head: *Send a Head request via http*
## Debug
* Clear: *Clear screen*
* Echo: *Print data to screen*
## Doc
* Doc#CommentGuide: *Auto scan file to detect the comment format which is generated to markdown document*

___

## Post
*Send a Post request via http*
```yaml
- Post:
    title: Create a new product
    baseURL: http://localhost:3000
    url: /product
    body:
      name: updated name
      quantity: 10
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
    var: newProduct
```
## Patch
*Send a Patch request via http*
```yaml
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
```
## Put
*Send a Put request via http*
```yaml
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
```
## Get
*Send a GET request via http*
```yaml
- Get:
    title: Get product details
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
```
## Delete
*Send a DELETE request via http*
```yaml
- Delete:
    title: Delete a product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(200)}
```
## Head
*Send a Head request via http*
```yaml
- Head:
    title: Ping a product
    baseURL: http://localhost:3000
    url: /product/:id
    params:
      id: 1
    validate:
      - title: Response status is valid
        chai: ${expect(_.response.status).to.equal(204)}
```
## Clear
*Clear screen*
```yaml
 - Clear:
```
## Echo
*Print data to screen*
```yaml
- Echo: Hello world
- Echo: ${msg}
```
## Doc#CommentGuide
*Auto scan file to detect the comment format which is generated to markdown document*
```yaml
- CommentGuide: 
    includes: 
      - src
    excludes: []
    includePattern: ".+\\.ts$"
    outFile: /tmp/doc.md
```