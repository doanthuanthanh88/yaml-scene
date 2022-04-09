import { existsSync, mkdirSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { dirname, join } from 'path'

const YAML_SCENE_CACHED_DIR = 'YAML_SCENE_CACHED_DIR'

export class FileUtils {
  private static _DefaultTmpDir?: string

  static MakeDirExisted(path: string, type = 'file' as 'file' | 'dir') {
    if (!existsSync(path)) {
      const dir = type === 'file' ? dirname(path) : path
      mkdirSync(dir, { recursive: true })
    }
    return path
  }

  static RemoveFilesDirs(...paths: string[]) {
    paths.forEach(path => existsSync(path) && rmSync(path, { recursive: true, force: true }))
  }

  static Existed(path: string) {
    if (!path) return false
    if (/^https?:\/\//.test(path)) return 'url'
    return existsSync(path)
  }

  static get UniqueName() {
    return Math.random().toString().substring(2)
  }

  static GetNewTempPath(ext = '', ...subPaths: string[]) {
    return join(this._DefaultTmpDir || (this._DefaultTmpDir = this.MakeDirExisted(join(process.env[YAML_SCENE_CACHED_DIR] || tmpdir(), 'yaml-scene.cached'), 'dir')), ...subPaths, this.UniqueName + ext)
  }

}