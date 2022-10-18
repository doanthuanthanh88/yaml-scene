import { CLI } from "@app/cli/CLI"
import { ElementFactory } from "@app/elements/ElementFactory"
import Exec from "@app/elements/Exec"
import UserInput from "@app/elements/UserInput"
import { ExtensionNotFound } from "@app/utils/error/ExtensionNotFound"
import { TraceError } from "@app/utils/error/TraceError"
import chalk from "chalk"
import { join } from "path"
import { LoggerManager } from "./LoggerManager"
import { Scenario } from "./Scenario"
import { ScenarioEvent } from "./ScenarioEvent"

export class InstallationManager {
  private static _Instance: InstallationManager

  static get Instance() {
    if (!this._Instance) {
      Scenario.Instance.events.once(ScenarioEvent.RESET, () => {
        this._Instance.stop()
        this._Instance = undefined
      })
      this._Instance = new InstallationManager()
    }
    return this._Instance
  }

  static async InstallPackage(installInfo: { dependencies: string[], localPath?: string, global?: boolean }) {
    let cmds = []
    const { dependencies = [], localPath = join(__dirname, '../../'), global } = installInfo
    if (global) {
      cmds = [
        { title: `in yarn global`, cmd: ['yarn', 'global', 'add', ...dependencies] },
        { title: `in npm global`, cmd: ['npm', 'install', '-g', ...dependencies] },
      ]
    } else {
      cmds = [
        { title: `yarn local at ${localPath}`, cmd: ['yarn', 'add', ...dependencies, '--prod', '-O', '--no-lockfile', '--no-bin-links', '--ignore-scripts', '--modules-folder', join(localPath, 'node_modules')].filter(e => e) },
        { title: `npm local at ${localPath}`, cmd: ['npm', 'install', ...dependencies, '--save-prod', '--prod', '--no-package-lock', '--no-bin-links', '--ignore-scripts', '--prefix', localPath].filter(e => e) }, //`${!isSave ? '--no-save' : ''}`,
      ]
      // if (!isSave) cmds.reverse()
    }
    let errors = []
    LoggerManager.GetLogger().info(chalk.green(`Installing ${dependencies.map(e => `"${e}"`).join(", ")}...`))
    for (const { title, cmd } of cmds) {
      try {
        const log = Exec.Run(cmd)
        if (log.error) throw log.error
        dependencies.forEach(e => LoggerManager.GetLogger().info(`${chalk.green('✔')} ${chalk.green(e)} ${chalk.gray(title)}`))
        errors = []
      } catch (err) {
        errors.push(err)
      }
    }
    if (errors.length) {
      throw new TraceError(`Could not install "${dependencies}" to ${global ? 'global' : `"${localPath}"`}`, { errors })
    }
  }

  static async UninstallPackage(installInfo: { dependencies: string[], localPath?: string }) {
    let cmds = []
    const { dependencies = [], localPath = join(__dirname, '../../') } = installInfo
    cmds = [
      { title: 'in yarn global', cmd: ['yarn', 'global', 'remove', ...dependencies] },
      { title: 'in npm global', cmd: ['npm', 'uninstall', '-g', ...dependencies] },
      { title: `yarn local at ${localPath}`, cmd: ['yarn', 'remove', '--prefix', localPath, ...dependencies].filter(e => e) },
      { title: `npm local at ${localPath}`, cmd: ['npm', 'uninstall', '--prefix', localPath, ...dependencies].filter(e => e) },
    ]
    let errors = []
    LoggerManager.GetLogger().info(chalk.gray(`Unstalling ...`))
    for (const { title, cmd } of cmds) {
      try {
        const log = Exec.Run(cmd)
        if (log.error) throw log.error
        dependencies.forEach(e => LoggerManager.GetLogger().info(`${chalk.green('✔')} ${chalk.gray.strikethrough(e)} ${chalk.gray(title)}`))
      } catch (err) {
        errors.push(err)
      }
    }
    if (errors.length === cmds.length) {
      throw new TraceError(`Could not install "${dependencies}" to ${global ? 'global' : `"${localPath}"`}`, { errors })
    }
  }

  static async UpgradePackage(installInfo: { dependencies: string[], localPath?: string }) {
    let cmds = []
    const { dependencies = [], localPath = join(__dirname, '../../') } = installInfo
    cmds = [
      { title: 'in yarn global', cmd: ['yarn', 'global', 'upgrade', ...dependencies] },
      { title: 'in npm global', cmd: ['npm', 'upgrade', '-g', ...dependencies] },
      { title: `yarn local at ${localPath}`, cmd: ['cd', localPath, '&&', 'yarn', 'upgrade', ...dependencies].filter(e => e) },
      { title: `npm local at ${localPath}`, cmd: ['cd', localPath, '&&', 'npm', 'upgrade', ...dependencies].filter(e => e) },
    ]
    let errors = []
    LoggerManager.GetLogger().info(chalk.yellow(`Upgrading ...`))
    for (const { title, cmd } of cmds) {
      try {
        const log = Exec.Run(cmd)
        if (log.error) throw log.error
        dependencies.forEach(e => LoggerManager.GetLogger().info(`${chalk.green('✔')} ${chalk.yellow(e)} ${chalk.gray(title)}`))
      } catch (err) {
        errors.push(err)
      }
    }
    if (errors.length === cmds.length) {
      throw new TraceError(`Could not upgrade "${dependencies}" to ${global ? 'global' : `"${localPath}"`}`, { errors })
    }
  }

  private dependencies = [] as { func: Function, args: any }[]
  private isInstalling: boolean

  async installNow(...infos: ExtensionNotFound[]) {
    this.dependencies.push(...infos.map(info => {
      return {
        func: async (info) => {
          const [extensionName] = info.extensionName.split("/", 1)
          LoggerManager.GetLogger().warn(chalk.yellow('⚠️', info.message))
          await this.installExtensions([extensionName], info.localPath, info.scope, info.force || CLI.Instance.force)
        },
        args: info
      }
    }))
    await this.start()
  }

  async install(...proms: { func: Function, args: any }[]) {
    this.dependencies.push(...proms)
    await this.start()
  }

  private async start() {
    if (this.isInstalling) return
    this.isInstalling = true
    let dep: { func: Function, args: any }

    new Array(10).fill(null).forEach(() => console.groupEnd())
    while (dep = this.dependencies.shift()) {
      await dep.func(dep.args)
    }
    this.isInstalling = false
  }

  private stop() {
    this.isInstalling = false
  }

  async installExtensions(extensionNames: string[], customPath?: string, installType = 'global' as 'local' | 'global', isForce = false as boolean) {
    extensionNames = extensionNames.map(e => e.trim()).filter(e => e)
    if (!extensionNames) return false
    await this.install({
      func: async (extensionNames) => {
        if (!isForce) {
          const confirmType = ElementFactory.CreateTheElement(UserInput)
          const choices = []
          if (installType === 'global') {
            choices.push({ title: `Global (Recommend)`, value: 'global', description: 'Install in global directory of "yarn" OR "npm"' })
          }
          choices.push({ title: `Local${installType === 'local' ? ' (Recommend)' : ''}`, value: 'local', description: `Install in "${customPath || 'yaml-scene'}"` })

          confirmType.init([{
            title: `Install ${extensionNames.map(e => chalk.yellow(`"${e}"`)).join(', ')} to:`,
            type: 'select',
            default: installType,
            choices,
            var: 'installType'
          }])
          await confirmType.prepare()
          const type = await confirmType.exec()
          installType = type.installType
          await confirmType.dispose()

          if (!installType) return false
        }
        await InstallationManager.InstallPackage(
          installType === 'local' ? {
            localPath: customPath,
            dependencies: extensionNames,
            global: false,
          } : {
            dependencies: extensionNames,
            global: true,
          })
        return true
      },
      args: extensionNames
    })
  }

  async uninstallExtensions(extensionNames: string[]) {
    extensionNames = extensionNames.map(e => e.trim()).filter(e => e)
    if (!extensionNames) return false
    await this.install({
      func: async (extensionNames: string[]) => {
        await InstallationManager.UninstallPackage({
          dependencies: extensionNames
        })
      },
      args: extensionNames
    })
  }

  async upgradeExtensions(extensionNames: string[]) {
    extensionNames = extensionNames.map(e => e.trim()).filter(e => e)
    if (!extensionNames) return false
    await this.install({
      func: async (extensionNames: string[]) => {
        await InstallationManager.UpgradePackage({
          dependencies: extensionNames
        })
      },
      args: extensionNames
    })
  }

}