import { existsSync, writeFileSync } from "fs"
import { join } from "path"
import { FileUtils } from "./FileUtils"

beforeAll(() => {
  FileUtils.CleanTempPath()
})

describe('MakeDirExisted', () => {
  afterEach(() => {
    FileUtils.CleanTempPath()
  })

  test('Auto make a dirrectory which is not existed', () => {
    const newDir = FileUtils.GetNewTempPathThenClean()
    expect(existsSync(newDir)).toEqual(false)
    FileUtils.MakeDirExisted(newDir, 'dir')
    expect(existsSync(newDir)).toEqual(true)
  })

  test('Auto make a dirrectory which got sub directories are not existed', () => {
    const newDir = FileUtils.GetNewTempPathThenClean(undefined, 'a/b/c')
    expect(existsSync(newDir)).toEqual(false)
    FileUtils.MakeDirExisted(newDir, 'dir')
    expect(existsSync(newDir)).toEqual(true)
  })

  test('Auto make a dirrectory which includes a file', () => {
    const newDir = FileUtils.GetNewTempPathThenClean('test.txt')
    expect(existsSync(newDir)).toEqual(false)
    FileUtils.MakeDirExisted(newDir, 'file')
    expect(existsSync(newDir)).toEqual(false)
    expect(existsSync(join(newDir, '..'))).toEqual(true)
  })

  test('Auto make a dirrectory which includes a file in sub directories are not existed', () => {
    const newDir = FileUtils.GetNewTempPathThenClean('test.txt', 'a/b/c')
    expect(existsSync(newDir)).toEqual(false)
    FileUtils.MakeDirExisted(newDir, 'file')
    expect(existsSync(newDir)).toEqual(false)
    expect(existsSync(join(newDir, '..'))).toEqual(true)
  })
})

describe('RemoveFilesDirs', () => {
  afterEach(() => {
    FileUtils.CleanTempPath()
  })

  test('Remove files', () => {
    const newDirs = [
      FileUtils.MakeDirExisted(FileUtils.GetNewTempPathThenClean('text.txt'), 'file'), // File in the root dir
      FileUtils.MakeDirExisted(FileUtils.GetNewTempPathThenClean('text1.txt', 'a/b/c'), 'file'), // folder $TMP/a/b/c/text1.txt
    ]
    newDirs.forEach(dir => {
      writeFileSync(dir, '')
      expect(existsSync(dir)).toBe(true)
    })

    FileUtils.RemoveFilesDirs(...newDirs)

    newDirs.forEach(dir => expect(existsSync(dir)).toBe(false))
  })

  test('Remove directories', () => {
    const newDirs = [
      FileUtils.MakeDirExisted(FileUtils.GetNewTempPathThenClean(undefined, 'a/b/c'), 'dir'), // folder $TMP/a/b/c
    ]
    newDirs.forEach(dir => expect(existsSync(dir)).toBe(true))

    FileUtils.RemoveFilesDirs(...newDirs)

    newDirs.forEach(dir => expect(existsSync(dir)).toBe(false))
  })

})

describe('Existed', () => {
  afterEach(() => {
    FileUtils.CleanTempPath()
  })

  test('Local file', () => {
    const path = FileUtils.GetNewTempPathThenClean('text.txt', 'a/b/c')
    expect(existsSync(path)).toEqual(false)

    FileUtils.MakeDirExisted(path, 'file')
    writeFileSync(path, '')

    expect(existsSync(path)).toEqual(true)
  })

  test('File is an URL', () => {
    expect(FileUtils.Existed('http://github.com/a/b/c.txt')).toEqual('url')
    expect(FileUtils.Existed('https://github.com/a/b/c.txt')).toEqual('url')
  })
})

describe('UniqueName', () => {
  it('Always is unique name', () => {
    const set = new Set()
    new Array(1000).fill(null).forEach(() => {
      const newOne = FileUtils.UniqueName
      expect(set.has(newOne)).toEqual(false)
      set.add(newOne)
    })
    expect(set.size).toEqual(1000)
  })
})

describe('GetNewTempPath', () => {
  process.env.YAML_SCENE_CACHED_DIR = '/tmp/test'

  afterAll(() => {
    FileUtils.RemoveFilesDirs(process.env.YAML_SCENE_CACHED_DIR + 'yaml-scene-cached')
  })

  it('Check new paths', () => {
    expect(FileUtils.GetNewTempPath('text.txt')).toEqual(`${process.env.YAML_SCENE_CACHED_DIR}/yaml-scene-cached/text.txt`)
    expect(FileUtils.GetNewTempPath('text.txt', 'a/b/c')).toEqual(`${process.env.YAML_SCENE_CACHED_DIR}/yaml-scene-cached/a/b/c/text.txt`)

    const rdFile = FileUtils.GetNewTempPath('.txt')
    expect(rdFile).toMatch(new RegExp(`${process.env.YAML_SCENE_CACHED_DIR}/yaml-scene-cached/\\d+\\.txt`))
  })

})

describe('GetNewTempPathThenClean & CleanTempPath', () => {
  process.env.YAML_SCENE_CACHED_DIR = '/tmp/test'
  const paths = []

  afterAll(() => {
    FileUtils.RemoveFilesDirs(process.env.YAML_SCENE_CACHED_DIR + 'yaml-scene-cached')
  })

  it('Check new paths', () => {
    paths.push(FileUtils.GetNewTempPathThenClean('text.txt'))
    expect(paths[paths.length - 1]).toEqual(`${process.env.YAML_SCENE_CACHED_DIR}/yaml-scene-cached/text.txt`)
    paths.push(FileUtils.GetNewTempPathThenClean('text.txt', 'a/b/c'))
    expect(paths[paths.length - 1]).toEqual(`${process.env.YAML_SCENE_CACHED_DIR}/yaml-scene-cached/a/b/c/text.txt`)

    paths.push(FileUtils.GetNewTempPathThenClean('.txt'))
    const rdFile = paths[paths.length - 1]
    expect(rdFile).toMatch(new RegExp(`${process.env.YAML_SCENE_CACHED_DIR}/yaml-scene-cached/\\d+\\.txt`))
  })

  it('Check after clean paths', () => {
    FileUtils.CleanTempPath()

    paths.forEach(p => expect(existsSync(p)).toEqual(false))
  })

})