import { NotificationFilterKind } from "./types";

interface Props {
  filter: NotificationFilterKind<"notification_figma_comment">;
  onChange: (filter: NotificationFilterKind<"notification_figma_comment">) => void;
}

export function FilterEditorFigma({ filter }: Props) {
  filter.figma_notification_id;

  return null;
}
