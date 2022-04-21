import { Simulator } from "@app/Simulator"
import { FileUtils } from "@app/utils/FileUtils"
import { existsSync, writeFileSync } from "fs"
import { join } from "path"

describe('File/Delete', () => {
  const tmpPath = FileUtils.GetNewTempPath()

  afterAll(() => {
    FileUtils.RemoveFilesDirs(tmpPath)
  })

  it('Delete files', async () => {
    // Preparing
    const newFile = join(tmpPath, 'test.tmp')
    FileUtils.MakeDirExisted(newFile, 'file')
    writeFileSync(newFile, 'test')
    expect(existsSync(newFile)).toEqual(true)

    await Simulator.Run(`
      - File/Delete:
        - ${newFile}
    `)
    expect(existsSync(newFile)).toEqual(false)
  })

  it('Delete directories', async () => {
    // Preparing
    const newDir = join(tmpPath, 'test')
    FileUtils.MakeDirExisted(newDir, 'dir')
    const newFile = join(newDir, 'test.tmp')
    writeFileSync(newFile, 'test')
    expect(existsSync(newDir)).toEqual(true)
    expect(existsSync(newFile)).toEqual(true)

    await Simulator.Run(`
      - File/Delete: ${newDir}
    `)
    expect(existsSync(newDir)).toEqual(false)
    expect(existsSync(newFile)).toEqual(false)
  })

  it('Delete files with pattern', async () => {
    // Preparing
    const newDir = join(tmpPath, 'test')
    const exts = ['a', 'b', 'c']
    FileUtils.MakeDirExisted(newDir, 'dir')
    exts.forEach((ext) => {
      const newFile = join(newDir, 'test.' + ext)
      writeFileSync(newFile, 'test ' + ext)
      expect(existsSync(newFile)).toEqual(true)
    })
    expect(existsSync(newDir)).toEqual(true)

    await Simulator.Run(`
      - File/Delete:
          title: Delete files with pattern
          paths: 
            - ${tmpPath}/**/*.a
    `, { logLevel: 'info' })

    exts.forEach((ext) => {
      const newFile = join(newDir, 'test.' + ext)
      expect(existsSync(newFile)).toEqual(ext !== 'a')
    })
    expect(existsSync(newDir)).toEqual(true)
  })
})