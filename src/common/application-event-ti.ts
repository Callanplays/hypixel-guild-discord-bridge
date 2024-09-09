/**
 * This module was automatically generated by `ts-interface-builder`
 */
import * as t from "ts-interface-checker";
// tslint:disable:object-literal-key-quotes

export const ApplicationEvents = t.iface([], {
  "*": t.func("void", t.param("name", "string"), t.param("event", "BaseEvent")),
  "chat": t.func("void", t.param("event", "ChatEvent")),
  "event": t.func("void", t.param("event", "ClientEvent")),
  "command": t.func("void", t.param("event", "CommandEvent")),
  "commandFeedback": t.func("void", t.param("event", "CommandFeedbackEvent")),
  "instance": t.func("void", t.param("event", "InstanceEvent")),
  "selfBroadcast": t.func("void", t.param("event", "InstanceSelfBroadcast")),
  "punishmentAdd": t.func("void", t.param("event", "PunishmentAddEvent")),
  "punishmentForgive": t.func("void", t.param("event", "PunishmentForgiveEvent")),
  "reconnectSignal": t.func("void", t.param("event", "ReconnectSignal")),
  "shutdownSignal": t.func("void", t.param("event", "ShutdownSignal")),
  "minecraftSelfBroadcast": t.func("void", t.param("event", "MinecraftSelfBroadcast")),
  "minecraftChat": t.func("void", t.param("event", "MinecraftRawChatEvent")),
  "minecraftSend": t.func("void", t.param("event", "MinecraftSendChat")),
  "statusMessage": t.func("void", t.param("event", "StatusMessageEvent")),
  "profanityWarning": t.func("void", t.param("event", "ProfanityWarningEvent")),
});

export const InstanceType = t.enumtype({
  "MAIN": "main",
  "PLUGIN": "plugin",
  "METRICS": "metrics",
  "SOCKET": "socket",
  "COMMANDS": "commands",
  "DISCORD": "discord",
  "MINECRAFT": "minecraft",
  "Logger": "webhook",
});

export const ChannelType = t.enumtype({
  "OFFICER": "officer",
  "PUBLIC": "public",
  "PRIVATE": "private",
});

export const BaseEvent = t.iface([], {
  "localEvent": "boolean",
});

export const InformEvent = t.iface(["BaseEvent"], {
  "instanceName": "string",
  "instanceType": "InstanceType",
});

export const SignalEvent = t.iface(["BaseEvent"], {
  "targetInstanceName": t.union("string", "undefined"),
});

export const ChatEvent = t.iface(["InformEvent"], {
  "channelType": "ChannelType",
  "channelId": t.union("string", "undefined"),
  "username": "string",
  "replyUsername": t.union("string", "undefined"),
  "message": "string",
});

export const ProfanityWarningEvent = t.iface(["InformEvent"], {
  "username": "string",
  "originalMessage": "string",
  "filteredMessage": "string",
  "channelType": "ChannelType",
});

export const EventType = t.enumtype({
  "AUTOMATED": "automated",
  "REQUEST": "request",
  "JOIN": "join",
  "LEAVE": "leave",
  "KICK": "kick",
  "QUEST": "quest",
  "PROMOTE": "promote",
  "DEMOTE": "demote",
  "MUTE": "mute",
  "UNMUTE": "unmute",
  "OFFLINE": "offline",
  "ONLINE": "online",
  "REPEAT": "repeat",
  "BLOCK": "block",
  "MUTED": "muted",
});

export const Severity = t.enumtype({
  "GOOD": 35328,
  "INFO": 8684544,
  "BAD": 9055488,
  "ERROR": 16711680,
  "DEFAULT": 592406,
});

export const ClientEvent = t.iface(["InformEvent"], {
  "channelType": "ChannelType",
  "eventType": "EventType",
  "username": t.union("string", "undefined"),
  "severity": "Severity",
  "message": "string",
  "removeLater": "boolean",
});

export const CommandEvent = t.iface(["InformEvent"], {
  "channelType": "ChannelType",
  "discordChannelId": t.opt("string"),
  "alreadyReplied": "boolean",
  "username": "string",
  "commandName": "string",
  "fullCommand": "string",
  "commandResponse": "string",
});

export const CommandFeedbackEvent = t.name("CommandEvent");

export const InstanceEventType = t.enumtype({
  "create": 0,
  "start": 1,
  "end": 2,
  "connect": 3,
  "disconnect": 4,
  "conflict": 5,
  "kick": 6,
});

export const InstanceEvent = t.iface(["InformEvent"], {
  "type": "InstanceEventType",
  "message": "string",
});

export const MinecraftRawChatEvent = t.iface(["InformEvent"], {
  "message": "string",
});

export const MinecraftSelfBroadcast = t.iface(["InformEvent"], {
  "username": "string",
  "uuid": "string",
});

export const InstanceSelfBroadcast = t.name("InformEvent");

export const PunishmentAddEvent = t.iface(["InformEvent"], {
  "type": "PunishmentType",
  "userName": "string",
  "userUuid": t.union("string", "undefined"),
  "userDiscordId": t.union("string", "undefined"),
  "reason": "string",
  "till": "number",
});

export const PunishmentForgiveEvent = t.iface(["InformEvent"], {
  "userIdentifiers": t.array("string"),
});

export const PunishmentType = t.enumtype({
  "MUTE": "mute",
  "BAN": "ban",
});

export const StatusMessageEvent = t.iface(["InformEvent"], {
  "message": "string",
});

export const MinecraftSendChat = t.iface(["SignalEvent"], {
  "command": "string",
});

export const ReconnectSignal = t.name("SignalEvent");

export const ShutdownSignal = t.iface(["SignalEvent"], {
  "restart": "boolean",
});

const exportedTypeSuite: t.ITypeSuite = {
  ApplicationEvents,
  InstanceType,
  ChannelType,
  BaseEvent,
  InformEvent,
  SignalEvent,
  ChatEvent,
  ProfanityWarningEvent,
  EventType,
  Severity,
  ClientEvent,
  CommandEvent,
  CommandFeedbackEvent,
  InstanceEventType,
  InstanceEvent,
  MinecraftRawChatEvent,
  MinecraftSelfBroadcast,
  InstanceSelfBroadcast,
  PunishmentAddEvent,
  PunishmentForgiveEvent,
  PunishmentType,
  StatusMessageEvent,
  MinecraftSendChat,
  ReconnectSignal,
  ShutdownSignal,
};
export default exportedTypeSuite;
