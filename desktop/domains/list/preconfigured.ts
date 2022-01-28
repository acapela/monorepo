import { DefinedList, defineList } from "./defineList";

export const inboxList = defineList({
  id: "inbox",
  name: "Inbox",
  filter(notification) {
    if (notification.resolved_at !== null) return false;
    if (!notification.inner) return false;

    return true;
  },
});

export const preconfiguredLists = {
  inbox: inboxList,
};

export function getPredefinedListById(id: string): DefinedList | null {
  return preconfiguredLists[id as keyof typeof preconfiguredLists] ?? null;
}
