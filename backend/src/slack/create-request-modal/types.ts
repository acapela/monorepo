import {
  AllMiddlewareArgs,
  MessageShortcut,
  SlackCommandMiddlewareArgs,
  SlackShortcutMiddlewareArgs,
} from "@slack/bolt";

export type SlashCommandRequest = SlackCommandMiddlewareArgs & AllMiddlewareArgs;
export type MessageShortcutRequest = SlackShortcutMiddlewareArgs<MessageShortcut> & AllMiddlewareArgs;
