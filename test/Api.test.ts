import { Simulator } from "@app/Simulator"
import { TimeUtils } from "@app/utils/time"
import { readFileSync, unlinkSync } from "fs"
import { join } from "path"

describe('Api CRUD, serve', () => {
  const port = 3003
  let server: any
  let isDone = false

  beforeAll(() => {
    return new Promise(async (resolve) => {
      await Simulator.Run(`
- Api~Server:
    title: Mock http request
    port: ${port}
    ref: server
    routers:
      - serveIn: ${join(__dirname, 'assets')}
      - path: /upload
        uploadTo: ${join(__dirname, 'assets', 'upload')}
      - method: GET
        path: /posts
        response:
          status: 200
          statusMessage: OK
          headers:
            server: nginx
          data: [
            { "id": 1, "title": "title", "author": "typicode" }
          ]
      - method: GET
        path: /posts/:id
        response:
          status: 200
          statusMessage: OK
          headers:
            server: nginx
          data: { "id": 1, "title": "title updated", "author": "typicode" }
      - method: POST
        path: /posts
        response:
          status: 200
          statusMessage: OK
          headers:
            server: nginx
          data: { "id": 2, "title": "title", "author": "typicode" }
      - method: PUT
        path: /posts/:id
        response:
          status: 200
          statusMessage: OK
          headers:
            server: nginx
          data: { "id": 2, "title": "title updated", "author": "typicode" }
      - method: PATCH
        path: /posts/:id
        response:
          status: 200
          statusMessage: OK
          headers:
            server: nginx
          data: { "id": 2, "title": "title updated", "author": "typicode" }
      - method: DELETE
        path: /posts/:id
        response:
          status: 200
          statusMessage: OK
          headers:
            server: nginx
  `, undefined, undefined, {
        onCreated(scenario) {
          scenario.events.on('scenario.exec', async (scenario) => {
            server = await TimeUtils.Until(scenario.variableManager.vars.server, '1s')
            resolve(undefined)
          })
          scenario.events.on('scenario.dispose', () => {
            isDone = true
          })
        }
      })
    })
  }, 60000)

  afterAll(async () => {
    await server.stop()
    while (!isDone) {
      await TimeUtils.Delay('1s')
    }
  })

  test('Get all of posts', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:${port}

- Api~Get:
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

- Api~Post:
    <-: base
    title: Create a new post
    url: /posts
    body:
      id: 2
      title: title 2
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

- Api~Put:
    <-: base
    title: Update a post
    url: /posts/:id
    params:
      id: 2
    body:
      id: 2
      title: title updated
      author: typicode 2 updated
    var: updatedOne
`)
    expect(scenario.variableManager.vars.updatedOne.title).toBe('title updated')
  })

  test('Update apart of post', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:${port}

- Api~Patch:
    <-: base
    title: Update a post
    url: /posts/:id
    params:
      id: 2
    body:
      id: 2
      title: title updated
      author: typicode 2 updated
    var: updatedHOne
`)
    expect(scenario.variableManager.vars.updatedHOne.title).toBe('title updated')
  })

  test('Get a post details', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:${port}

- Api~Get:
    <-: base
    title: Get a post details
    url: /posts/:id
    params:
      id: 2
    var: details
`)
    expect(scenario.variableManager.vars.details.title).toBe('title updated')
  })

  test('Delete a post', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:${port}

- Api~Delete:
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

  test('Upload file', async () => {
    const scenario = await Simulator.Run(`
- Templates:
  - Api:
      ->: base
      baseURL: http://localhost:${port}

- Api~Post:
    <-: base
    title: Upload a file to server
    url: /upload
    headers:
      content-type: multipart/form-data
    body:
      name: a
      file1: !binary ${join(__dirname, 'assets/test1.txt')}
      file2: !binary ${join(__dirname, 'assets/test2.txt')}
    var: filesUpload
`)
    expect(Object.keys(scenario.variableManager.vars.filesUpload).length).toEqual(3)
    expect(readFileSync(scenario.variableManager.vars.filesUpload.file1.path).toString()).toEqual('Hello 1')
    expect(readFileSync(scenario.variableManager.vars.filesUpload.file2.path).toString()).toEqual('Hello 2')

    unlinkSync(scenario.variableManager.vars.filesUpload.file1.path)
    unlinkSync(scenario.variableManager.vars.filesUpload.file2.path)
  })

  test('Get static file', async () => {
    const scenario = await Simulator.Run(`
    - Templates:
      - Api:
          ->: base
          baseURL: http://localhost:${port}
    
    - Api~Get:
        <-: base
        title: Get a static file
        url: /test1.txt
        var: staticFile
    `)
    expect(scenario.variableManager.vars.staticFile).toEqual('Hello 1')
  })

})