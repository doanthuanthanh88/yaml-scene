import { Simulator } from "@app/Simulator"
import { VariableManager } from "@app/singleton/VariableManager"
import { FileUtils } from "@app/utils/FileUtils"
import { readdirSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { Readable } from "stream"

describe.skip('!binary tag', () => {
  const uploadDir = join(tmpdir(), 'uploadFile')

  beforeAll(() => {
    FileUtils.MakeDirExisted(uploadDir, 'dir')
  })

  afterAll(() => {
    FileUtils.RemoveFilesDirs(uploadDir)
  })

  test('Upload local file', async () => {
    await Simulator.Run(`
- Vars:
    uploadDir: ${uploadDir}
    uploadFile: ${join(__dirname, '../assets/custom1.js')}
- Vars:
    myBin: !tag
      tags/binary: \${uploadFile}

- Fragment: ${join(__dirname, 'upload.yas.yaml')}
    
- yas-http/Post:
    async: true
    baseURL: http://localhost:8000
    url: /upload
    headers:
      content-type: multipart/form-data
    body:
      files: !tag
        tags/binary: \${uploadFile}
`)
    expect(VariableManager.Instance.vars.myBin).toBeInstanceOf(Readable)
    expect(readdirSync(uploadDir).length).toBe(1)
  })

  test('Upload file from URL', async () => {
    await Simulator.Run(`
- Vars:
    uploadDir: ${uploadDir}
    uploadFile: https://raw.githubusercontent.com/doanthuanthanh88/yaml-scene/main/tsconfig.json
- Vars:
    myBin: !tag
      tags/binary: \${uploadFile}

- Fragment: ${join(__dirname, 'upload.yas.yaml')}

- yas-http/Post:
    async: true
    baseURL: http://localhost:8000
    url: /upload
    headers:
      content-type: multipart/form-data
    body:
      files: !tag
        tags/binary: \${uploadFile}
`)
    expect(VariableManager.Instance.vars.myBin).toBeInstanceOf(Readable)
    expect(readdirSync(uploadDir).length).toBe(2)
  })
})