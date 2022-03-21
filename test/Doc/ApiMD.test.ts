import Server from "@app/elements/Api/Server"
import { ElementFactory } from "@app/elements/ElementFactory"
import { Simulator } from "@app/Simulator"
import { TimeUtils } from "@app/utils/time"
import { readFileSync } from "fs"
import { join } from "path"

describe('Test to generate api document', () => {
  let server: any

  beforeAll(async () => {
    const scenario = await Simulator.Run()
    server = ElementFactory.CreateElement<Server>('Api/Server', scenario)
    server.init({
      host: 'localhost',
      port: 3000,
      routers: [
        {
          path: '/posts',
          CRUD: true,
          init: [
            {
              "id": 1,
              "title": "title",
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
        }
      ]
    })
    await server.prepare()
    server.exec()
    await TimeUtils.Delay('3s')
  }, 60000)

  afterAll(async () => {
    await server.dispose()
  })

  test('Export to api document markdown', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:3000

- Api/Get:
    <-: base
    title: Get all of posts
    url: /posts
    var: posts
    doc: 
      tags: [POST, RETURNS]

- Api/Post:
    <-: base
    title: Create a new post
    url: /posts
    body:
      id: 2
      title: title 2
      author: typicode 2
    var: newOne
    doc: 
      tags: [POST, ACTIONS]

- Api/Put:
    <-: base
    title: Update a post
    url: /posts/:id
    params:
      id: 2
    body:
      id: 2
      title: title 2 updated
      author: typicode 2 updated
    var: updatedOne
    doc: 
      tags: [POST, ACTIONS]

- Api/Get:
    <-: base
    title: Get a post details
    url: /posts/:id
    params:
      id: 2
    var: details
    doc: 
      tags: [POST, RETURNS]

- Api/Get:
    <-: base
    title: This is documented by default tag
    url: /posts/:id
    params:
      id: 2
    var: details
    doc: true

- Api/Get:
    <-: base
    title: This is not documented
    url: /posts/:id
    params:
      id: 2
    var: details
    doc: false

- Api/Delete:
    <-: base
    title: Delete a post
    url: /posts/:id
    params:
      id: 2
    var: 
      status: \${_.response.status}
    doc: 
      tags: [POST, ACTIONS]

- Doc/Api/MD:
    title: Post service
    description: Demo CRUD API to generate to markdown document
    signature: "[Doan Thuan Thanh](mailto:doanthuanthanh88@gmail.com)"
    outFile: ${join(__dirname, 'ApiMD.md')}
`)
    expect(scenario.variableManager.vars.posts).toHaveLength(1)
    expect(scenario.variableManager.vars.newOne?.id).toBe(2)
    expect(scenario.variableManager.vars.updatedOne.title).toBe('title 2 updated')
    expect(scenario.variableManager.vars.details.title).toBe('title 2 updated')
    expect(scenario.variableManager.vars.status).toBe(204)

    const cnt = readFileSync(`${join(__dirname, 'ApiMD.md')}`).toString()
    expect(cnt).toContain('Get a post details')
    expect(cnt).not.toContain('This is not documented')
  }, 60000)
})