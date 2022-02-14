import { NotificationFilterKind } from "./types";

interface Props {
  filter: NotificationFilterKind<"notification_slack_message">;
  onChange: (filter: NotificationFilterKind<"notification_slack_message">) => void;
}

export function FilterEditorSlack({ filter }: Props) {
  filter.conversation_name;

  return null;
}
