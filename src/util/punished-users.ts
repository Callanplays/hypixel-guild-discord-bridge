import fs from 'node:fs'

import * as t from 'ts-interface-checker'
import { createCheckers } from 'ts-interface-checker'

import type Application from '../application'
import type { PunishmentAddEvent, PunishmentForgiveEvent } from '../common/application-event'
import { PunishmentType } from '../common/application-event'
import ApplicationEventTi from '../common/application-event-ti'

import type { MojangApi } from './mojang'

const applicationEventChecker = createCheckers({ ...ApplicationEventTi, PunishmentList: t.array('PunishmentAddEvent') })

type PunishmentsRecord = Record<PunishmentType, PunishmentAddEvent[]>

export class PunishedUsers {
  private static readonly CONFIG_NAME = 'punishments.json'
  private readonly app: Application
  private readonly configFilePath: string
  private punishmentsRecord: PunishmentsRecord = {
    [PunishmentType.MUTE]: [],
    [PunishmentType.BAN]: []
  }

  constructor(app: Application) {
    this.app = app
    this.configFilePath = app.getConfigFilePath(PunishedUsers.CONFIG_NAME)
    this.loadFromConfig()

    app.on('punishmentAdd', (event) => {
      if (event.localEvent) return
      this.punish(event)
    })
    app.on('punishmentForgive', (event) => {
      if (event.localEvent) return
      this.forgive(event)
    })
  }

  public punish(event: PunishmentAddEvent): void {
    if (event.localEvent) this.app.emit('punishmentAdd', event)

    const originalList = this.punishmentsRecord[event.type]
    const currentTime = Date.now()
    const identifiers = [event.userName, event.userUuid, event.userDiscordId].filter(
      (id) => id !== undefined
    ) as string[]

    const modifiedList = originalList.filter(
      (punishment) => punishment.till < currentTime && !this.matchIdentifier(punishment, identifiers)
    )

    modifiedList.push(event)
    this.punishmentsRecord[event.type] = modifiedList
    this.saveConfig()
  }

  public forgive(event: PunishmentForgiveEvent): PunishmentAddEvent[] {
    if (event.localEvent) this.app.emit('punishmentForgive', event)

    const result: PunishmentAddEvent[] = []

    const currentTime = Date.now()
    for (const type of Object.keys(this.punishmentsRecord) as PunishmentType[]) {
      this.punishmentsRecord[type] = this.punishmentsRecord[type].filter((punishment) => {
        if (punishment.till < currentTime) return false
        const shouldDelete = this.matchIdentifier(punishment, event.userIdentifiers)
        if (shouldDelete) {
          result.push(punishment)
          return false
        }
        return true
      })
    }

    this.saveConfig()
    return result
  }

  getPunishedTill(identifiers: string[], type: PunishmentType): number | undefined {
    const allPunishments = this.punishmentsRecord[type]

    const current = Date.now()
    const punishment = allPunishments.find((p) => p.till > current && this.matchIdentifier(p, identifiers))

    if (punishment) {
      return punishment.till
    }
    return undefined
  }

  findPunishmentsByUser(identifiers: string[]): PunishmentAddEvent[] {
    const current = Date.now()
    const result: PunishmentAddEvent[] = []

    for (const [, events] of Object.entries(this.punishmentsRecord)) {
      result.push(...events.filter((event) => event.till > current && this.matchIdentifier(event, identifiers)))
    }

    return result
  }

  getAllPunishments(): PunishmentAddEvent[] {
    const current = Date.now()
    const result: PunishmentAddEvent[] = []

    for (const [, events] of Object.entries(this.punishmentsRecord)) {
      result.push(...events.filter((event) => event.till > current))
    }

    return result
  }

  getPunishmentsByType(type: PunishmentType): PunishmentAddEvent[] {
    return this.punishmentsRecord[type]
  }

  static async getMinecraftIdentifiers(mojangApi: MojangApi, username: string): Promise<string[]> {
    const mojangProfile = await mojangApi.profileByUsername(username).catch(() => undefined)
    const identifiers = [username]
    if (mojangProfile) identifiers.push(mojangProfile.id, mojangProfile.name)
    return identifiers
  }

  static tillTimeToMinecraftDuration(till: number): string {
    // 30 day in seconds
    // Max allowed duration in minecraft. It is a hard limit from server side
    const MAX_DURATION = 2_592_000
    const PREFIX = 's' // for "seconds"

    const currentTime = Date.now()
    const remainingTime = till - currentTime
    return Math.min(MAX_DURATION, Math.floor(remainingTime / 1000)) + PREFIX
  }
  private loadFromConfig(): void {
    if (!fs.existsSync(this.configFilePath)) return

    const fileData = fs.readFileSync(this.configFilePath, 'utf8')
    const punishmentsRecord = JSON.parse(fileData) as PunishmentsRecord

    for (const [type, punishments] of Object.entries(punishmentsRecord)) {
      applicationEventChecker.PunishmentType.check(type)
      applicationEventChecker.PunishmentList.check(punishments)
    }

    this.punishmentsRecord = punishmentsRecord
  }

  private saveConfig(): void {
    const dataRaw = JSON.stringify(this.punishmentsRecord, undefined, 4)
    fs.writeFileSync(this.configFilePath, dataRaw, { encoding: 'utf8' })
  }

  private matchIdentifier(punishment: PunishmentAddEvent, identifiers: string[]): boolean {
    return identifiers.some((identifier) => {
      return (
        punishment.userName.toLowerCase() === identifier.toLowerCase() ||
        punishment.userUuid?.toLowerCase() === identifier.toLowerCase() ||
        punishment.userDiscordId?.toLowerCase() === identifier.toLowerCase()
      )
    })
  }
}
