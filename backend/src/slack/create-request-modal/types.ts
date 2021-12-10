import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from "@slack/bolt";

export type SlashCommandRequest = SlackCommandMiddlewareArgs & AllMiddlewareArgs;
