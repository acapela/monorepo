import { desktopRouter } from "@aca/desktop/routes";

export type ConfiguredListName = "inbox" | "important" | "relevant" | "other";

export function navigateToList(listName: ConfiguredListName) {
  desktopRouter.navigate("list", { listId: listName });
}
