/*
 CREDIT: Idea by Aura
 Discord: Aura#5051
 Minecraft username: _aura
*/

import { ChatCommandContext, ChatCommandHandler } from '../common/CommandInterface'

export default class IqCommand extends ChatCommandHandler {
  constructor() {
    super({
      name: 'IQ',
      triggers: ['iq'],
      description: "Returns a player's IQ (0-200)",
      example: `iq %s`
    })
  }

  handler(context: ChatCommandContext): string {
    const givenUsername = context.args[0] ?? context.username
    return `${givenUsername} has an IQ of ${Math.floor(Math.random() * 200)}`
  }
}
