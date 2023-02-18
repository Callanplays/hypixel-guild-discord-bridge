import MinecraftInstance from "../MinecraftInstance"
import {MinecraftChatMessage} from "../common/ChatInterface"
import {LOCATION} from "../../../common/ClientInstance"
import {ColorScheme} from "../../discord/common/DiscordConfig";
import {CommandsManager} from "../CommandsManager";
import {EventType} from "../../../common/ApplicationEvent";

const {SCOPE} = require("../../../common/ClientInstance")


export default <MinecraftChatMessage>{
    onChat: function (clientInstance: MinecraftInstance, commandsManager: CommandsManager, message: string): void {
        let regex = /^Guild > (\w{3,32}) joined./g

        let match = regex.exec(message)
        if (match != null) {
            let username = match[1]

            clientInstance.app.emit("event", {
                localEvent: true,
                instanceName: clientInstance.instanceName,
                location: LOCATION.MINECRAFT,
                scope: SCOPE.PUBLIC,
                name: EventType.ONLINE,
                username: username,
                severity: ColorScheme.INFO,
                message: message,
                removeLater: true
            })
        }
    }
}