import type { MinecraftSendChat } from '../../../common/application-event.js'
import EventHandler from '../../../common/event-handler.js'
import type MinecraftInstance from '../minecraft-instance.js'

export default class SendchatHandler extends EventHandler<MinecraftInstance> {
  constructor(minecraftInstance: MinecraftInstance) {
    super(minecraftInstance)

    minecraftInstance.app.on('minecraftSend', (event) => {
      void this.onCommand(event)
    })
  }

  private async onCommand(event: MinecraftSendChat): Promise<void> {
    // undefined is strictly checked due to api specification
    if (event.targetInstanceName === undefined || event.targetInstanceName === this.clientInstance.instanceName) {
      await this.clientInstance.send(event.command)
    }
  }
}
