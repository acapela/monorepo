import { desktopRouter } from "@aca/desktop/routes";

const configuredListNames = ["inbox", "important", "relevant", "other"] as const;

export type ConfiguredListName = typeof configuredListNames[number];

export interface ConfiguredListData {
  id: ConfiguredListName;
  name: string;
}

export const inboxList: ConfiguredListData = {
  id: "inbox",
  name: "Inbox",
};

export const importantList: ConfiguredListData = {
  id: "important",
  name: "Important",
};

export const relevantList: ConfiguredListData = {
  id: "relevant",
  name: "Relevant",
};

export const otherList: ConfiguredListData = {
  id: "other",
  name: "Other",
};

export function getIsConfiguredList(input: unknown): input is ConfiguredListData {
  const id = (<ConfiguredListData>input)?.id;

  if (!id) return false;

  return configuredListNames.includes(id);
}

export function navigateToList(listName: ConfiguredListName) {
  desktopRouter.navigate("list", { listId: listName });
}
