import { Simulator } from "@app/Simulator"
import jsonServer from 'json-server'
import { reject } from "lodash"
import { join } from "path"

describe('Test to generate api document', () => {
  let server: any

  beforeAll(() => {
    return new Promise((resolve) => {
      try {
        const router = jsonServer.router({
          "posts": [
            {
              "id": 1,
              "title": "json-server",
              "labels": ["news", "user"],
              "creator": {
                "name": "thanh",
                "created_time": Date.now()
              },
              "tags": [
                {
                  "id": 1,
                  "name": "thanh 1"
                },
                {
                  "id": 2,
                  "name": "thanh 2"
                }
              ]
            }
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

  test('Export to api document markdown', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:3000

- Api~get:
    <-: base
    title: Get all of posts
    url: /posts
    var: posts

- Api~post:
    <-: base
    title: Create a new post
    url: /posts
    body:
      id: 2
      title: json-server 2
      author: typicode 2
    var: newOne

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

- Api~get:
    <-: base
    title: Get a post details
    url: /posts/:id
    params:
      id: 2
    var: details

- Api~del:
    <-: base
    title: Delete a post
    url: /posts/:id
    params:
      id: 2
    var: 
      status: \${_.response.status}

- Doc~ApiMD:
    title: Post service
    description: Demo CRUD API to generate to markdown document
    signature: "[Doan Thuan Thanh](mailto:doanthuanthanh88@gmail.com)"
    outFile: ${join(__dirname, 'ApiMD.md')}
`)
    expect(scenario.variableManager.vars.posts).toHaveLength(1)
    expect(scenario.variableManager.vars.newOne?.id).toBe(2)
    expect(scenario.variableManager.vars.updatedOne.title).toBe('json-server 2 updated')
    expect(scenario.variableManager.vars.details.title).toBe('json-server 2 updated')
    expect(scenario.variableManager.vars.status).toBe(200)
  })
})