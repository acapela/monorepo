import { NotificationFilterKind } from "./types";

interface Props {
  filter: NotificationFilterKind<"notification_notion">;
  onChange: (filter: NotificationFilterKind<"notification_notion">) => void;
}

export function FilterEditorNotion({ filter }: Props) {
  filter.page_title;

  return null;
}
