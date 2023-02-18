import MinecraftInstance from "../MinecraftInstance"
import {LOCATION, SCOPE} from "../../../common/ClientInstance"
import {MinecraftChatMessage} from "../common/ChatInterface";
import {sufficeToTime} from "../../../util/SharedUtil";
import {ColorScheme} from "../../discord/common/DiscordConfig";
import {CommandsManager} from "../CommandsManager";
import {EventType} from "../../../common/ApplicationEvent";


export default <MinecraftChatMessage>{
    onChat: function (clientInstance: MinecraftInstance, commandsManager: CommandsManager, message: string): void {
        let regex = /^(?:\[[A-Z+]{1,10}\] ){0,3}\w{3,32} has muted (?:\[[A-Z+]{1,10}\] ){0,3}(\w{3,32}) for (\d)([smhd])/g

        let match = regex.exec(message)
        if (match != null) {
            let username = match[1]
            let muteTime = <any>match[2]
            let muteSuffice = match[3]

            clientInstance.app.punishedUsers.mute(username, muteTime * sufficeToTime(muteSuffice))

            clientInstance.app.emit("event", {
                localEvent: true,
                instanceName: clientInstance.instanceName,
                location: LOCATION.MINECRAFT,
                scope: SCOPE.OFFICER,
                name: EventType.MUTE,
                username: username,
                severity: ColorScheme.BAD,
                message: message,
                removeLater: false
            })
        }
    }
}