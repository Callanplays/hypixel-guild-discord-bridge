import type { ChatInputCommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from 'discord.js'
import type { DiscordCommandInterface } from '../common/DiscordCommandInterface'
import { Permission } from '../common/DiscordCommandInterface'
import type DiscordInstance from '../DiscordInstance'

export default {
  getCommandBuilder: () => new SlashCommandBuilder().setName('reconnect').setDescription('reconnect minecraft clients'),
  allowInstance: true,
  permission: Permission.HELPER,

  handler: async function (clientInstance: DiscordInstance, interaction: ChatInputCommandInteraction) {
    await interaction.deferReply()

    const targetInstance: string | null = interaction.options.getString('instance')
    clientInstance.app.emit('reconnectSignal', {
      localEvent: true,
      targetInstanceName: targetInstance ?? undefined
    })
    await interaction.editReply('Reconnect signal has been sent!')
  }
} satisfies DiscordCommandInterface
