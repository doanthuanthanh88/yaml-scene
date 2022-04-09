import { existsSync, mkdirSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { dirname, join } from 'path'

const YAML_SCENE_CACHED_DIR = 'YAML_SCENE_CACHED_DIR'

/**
 * Utility functionals to handle File
 * @class
 */
export class FileUtils {
  private static _DefaultTmpDir?: string

  /**
   * Auto make dir or file if it's not existed
   * @param {string} path Path of file or directory
   * @param {'file' | 'dir'} [type=file] Specific input path is `file` or `dir`. Default is `file`
   * @returns Input path
   */
  static MakeDirExisted(path: string, type: 'file' | 'dir' = 'file') {
    if (!existsSync(path)) {
      const dir = type === 'file' ? dirname(path) : path
      mkdirSync(dir, { recursive: true })
    }
    return path
  }

  /**
   * Remove files or folders
   * @param {...string} paths Path of dirs or files
   */
  static RemoveFilesDirs(...paths: string[]) {
    paths.forEach(path => existsSync(path) && rmSync(path, { recursive: true, force: true }))
  }

  /**
   * Check file path/URL is existed or not
   * @param {string} path Path of file, dir or link
   * @returns {'url' | boolean} Return true: Existed, false: Not existed, 'url': It's a link
   */
  static Existed(path: string) {
    if (!path) return false
    if (/^https?:\/\//.test(path)) return 'url'
    return existsSync(path)
  }

  /**
   * Get unique name
   */
  static get UniqueName() {
    return Math.random().toString().substring(2)
  }

  /**
   * Get unique path of file or dir in tmp dir in os
   * @param {string} [ext=''] File name which includes extensions or only extension. Example '.text' || 'abc.txt'
   * @param {...string} subPaths Subpath
   * @returns {string} New unique path which in tmp dir in os
   * @example GetNewTempPath('abc.txt', 'node_modules') => /tmp/$UNIQUE/node_modules/abc.txt
   */
  static GetNewTempPath(ext = '', ...subPaths: string[]) {
    return join(this._DefaultTmpDir || (this._DefaultTmpDir = this.MakeDirExisted(join(process.env[YAML_SCENE_CACHED_DIR] || tmpdir(), 'yaml-scene.cached'), 'dir')), ...subPaths, this.UniqueName + ext)
  }

}