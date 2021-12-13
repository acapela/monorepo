import { Blocks, Message as SlackMessage } from "slack-block-builder";

export function NewUserOnboardingMessage() {
  return SlackMessage()
    .blocks(
      Blocks.Section({ text: "Hi there 🤗" }),
      Blocks.Section({ text: "Thank you for installing Acapela!" }),
      Blocks.Section({
        text: "Use Acapela by starting to type `/acapela` in any of the channels you are already invited to.",
      }),
      Blocks.Divider()
    )
    .buildToObject();
}
