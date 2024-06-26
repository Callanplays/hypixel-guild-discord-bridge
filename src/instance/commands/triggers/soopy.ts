import type { AxiosResponse } from 'axios'
import axios from 'axios'
import NodeCache from 'node-cache'

import type { ChatCommandContext } from '../common/command-interface.js'
import { ChatCommandHandler } from '../common/command-interface.js'

export default class Soopy extends ChatCommandHandler {
  private readonly SOOPY_API_URL = 'https://soopy.dev/api/soopyv2/botcommand'
  private readonly ALLOWED_COMMANDS = [
    'kuudra',
    'bazzar',
    'bz',
    'auctions',
    'ah',
    'skilllevel',
    'sl',
    'skills',
    'skillaverage',
    'sa',
    'dojo',
    'overflowskills',
    'oskills',
    'overflowskillaverage',
    'osa',
    'trophyfishes',
    'trophyfish',
    'bestiary',
    'faction',
    'stathistory',
    'chevent',
    'chevents',
    'gemstones',
    'nucleus',
    'guildof',
    'guild',
    'sack',
    'collection',
    'coll',
    'kills',
    'deaths',
    'hotm',
    'essence',
    'powder',
    'secrets',
    'weight',
    'slayer',
    'bank',
    'purse',
    'coins',
    'pet',
    'ehp',
    'coinflip',
    'whatdoing',
    'stalk',
    'dungeon',
    'catacombs',
    'catacomb',
    'cata',
    'currdungeon',
    'dungeonteam',
    'dungeonsteam',
    'sblvl',
    'skyblocklevel',
    'sblevel',
    'classaverage',
    'ca',
    'timesinceapiupdated',
    'runstillclassaverage',
    'rtca',
    'runstillclasslvl',
    'runstillcata',
    'floorstats',
    'skill',
    'mayor',
    'irlworth',
    'lbpos',
    'nextmayor',
    'nw',
    'networth',
    'lowestbin',
    'calcskill'
  ]
  private readonly cache = new NodeCache({
    maxKeys: 10_000,
    stdTTL: 5 * 60
  })

  constructor() {
    super({
      name: 'Soopy',
      triggers: ['soopy', '-'],
      description: 'Use SoopyV2 API to execute commands',
      example: `- rtca`
    })
  }

  async handler(context: ChatCommandContext): Promise<string> {
    const commandName = context.args[0]
    const commandArguments = context.args.length > 1 ? context.args.slice(1, context.args.length) : []

    const fullCommand = `${commandName} ${commandArguments.join(' ')}`

    if (!this.ALLOWED_COMMANDS.includes(commandName.toLowerCase())) {
      return `${context.username}, command not defined or allowed to use with Soopy!`
    }

    const cachedResult = this.cache.get(Soopy.createCacheKey(context.username, fullCommand))
    if (cachedResult) {
      return Soopy.formatResponse(context.username, cachedResult as string)
    }

    try {
      const result = await axios
        .get(this.SOOPY_API_URL, { timeout: 2 * 60 * 1000, data: { m: fullCommand, u: context.username } })
        .then((response: AxiosResponse<string, unknown>) => response.data)

      this.cache.set(Soopy.createCacheKey(context.username, fullCommand), result)
      return Soopy.formatResponse(context.username, result)
    } catch (error: unknown) {
      context.logger.error(error)
      return `${context.username}, Error while talking to Soopy API.`
    }
  }

  private static formatResponse(username: string, result: string): string {
    return `${username} Soopy: ${result}`
  }

  private static createCacheKey(username: string, fullCommand: string): string {
    return `${username}/${fullCommand}`
  }
}
