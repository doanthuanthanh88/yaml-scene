import { Simulator } from "@app/Simulator"
import jsonServer from 'json-server'
import { reject } from "lodash"

describe('Test CRUD', () => {
  let server: any
  const port = 3003

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
        server = app.listen(port, () => {
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
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:${port}

- Api~get:
    <-: base
    title: Get all of posts
    url: /posts
    var: posts
`)
    expect(scenario.variableManager.vars.posts).toHaveLength(1)
  })

  test('Create a new posts', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:${port}

- Api~post:
    <-: base
    title: Create a new post
    url: /posts
    body:
      id: 2
      title: json-server 2
      author: typicode 2
    var: newOne
`)
    expect(scenario.variableManager.vars.newOne?.id).toBe(2)
  })

  test('Update a post', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:${port}

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
`)
    expect(scenario.variableManager.vars.updatedOne.title).toBe('json-server 2 updated')
  })

  test('Get a post details', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:${port}

- Api~get:
    <-: base
    title: Get a post details
    url: /posts/:id
    params:
      id: 2
    var: details
`)
    expect(scenario.variableManager.vars.details.title).toBe('json-server 2 updated')
  })

  test('Delete a post', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:${port}

- Api~del:
    <-: base
    title: Delete a post
    url: /posts/:id
    params:
      id: 2
    var: 
      status: \${_.response.status}
`)
    expect(scenario.variableManager.vars.status).toBe(200)
  })
})