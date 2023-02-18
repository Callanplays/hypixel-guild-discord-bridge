import {CommandInteraction, SlashCommandBuilder} from "discord.js"
import {DiscordCommandInterface, Permission} from "../common/DiscordCommandInterface"
import DiscordInstance from "../DiscordInstance"

export default <DiscordCommandInterface>{
    commandBuilder: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick player out of the guild in-game')
        .addStringOption(option =>
            option.setName('username')
                .setDescription('Username of the player')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('reason to kick the player')
                .setRequired(true)),
    permission: Permission.STAFF,

    handler: async function (clientInstance: DiscordInstance, interaction: CommandInteraction) {
        await interaction.deferReply()

        // @ts-ignore
        let username = interaction.options.getString("username")
        // @ts-ignore
        let reason = interaction.options.getString("reason")
        clientInstance.app.clusterHelper.sendCommandToAllMinecraft(`/g kick ${username} ${reason}`)

        await interaction.editReply(`Command sent to kick ${username}!`)
    }
}