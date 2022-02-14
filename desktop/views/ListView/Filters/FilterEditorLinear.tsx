import { NotificationFilterKind } from "./types";

interface Props {
  filter: NotificationFilterKind<"notification_linear">;
  onChange: (filter: NotificationFilterKind<"notification_linear">) => void;
}

export function FilterEditorLinear({ filter }: Props) {
  filter.type;

  return null;
}
