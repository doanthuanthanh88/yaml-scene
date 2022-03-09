import { Simulator } from "@app/Simulator"
import { VarManager } from "@app/singleton/VarManager"
import jsonServer from 'json-server'
import { reject } from "lodash"

describe('Test CRUD', () => {
  let server: any

  beforeAll(() => {
    return new Promise((resolve) => {
      try {
        const router = jsonServer.router({
          "posts": [
            { "id": 1, "title": "json-server", "author": "typicode" }
          ]
        })
        const middlewares = jsonServer.defaults()
        const app = jsonServer.create()
        app.use(middlewares)
        app.use(router)
        server = app.listen(3000, () => {
          resolve(undefined)
        })
      } catch (err) {
        reject(err)
      }
    })
  })

  afterAll(() => {
    return new Promise((resolve, reject) => {
      server.close((err) => {
        !err ? resolve(undefined) : reject(err)
      })
    })
  })

  test('Get all of posts', async () => {
    await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:3000

- Api~get:
    <-: base
    title: Get all of posts
    url: /posts
    var: posts
`, undefined, 'slient')
    expect(VarManager.Instance.vars.posts).toHaveLength(1)
  })

  test('Create a new posts', async () => {
    await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:3000

- Api~post:
    <-: base
    title: Create a new post
    url: /posts
    body:
      id: 2
      title: json-server 2
      author: typicode 2
    var: newOne
`, undefined, 'slient')
    expect(VarManager.Instance.vars.newOne?.id).toBe(2)
  })

  test('Update a post', async () => {
    await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:3000

- Api~put:
    <-: base
    title: Update a post
    url: /posts/:id
    params:
      id: 2
    body:
      id: 2
      title: json-server 2 updated
      author: typicode 2 updated
    var: updatedOne
`, undefined, 'slient')
    expect(VarManager.Instance.vars.updatedOne.title).toBe('json-server 2 updated')
  })

  test('Get a post details', async () => {
    await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:3000

- Api~get:
    <-: base
    title: Get a post details
    url: /posts/:id
    params:
      id: 2
    var: details
`, undefined, 'slient')
    expect(VarManager.Instance.vars.details.title).toBe('json-server 2 updated')
  })

  test('Delete a post', async () => {
    await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:3000

- Api~del:
    <-: base
    title: Delete a post
    url: /posts/:id
    params:
      id: 2
    var: 
      status: \${_.response.status}
`, undefined, 'slient')
    expect(VarManager.Instance.vars.status).toBe(200)
  })
})