import { Menu, MenuItemConstructorOptions, Tray } from "electron";
import { sortBy } from "lodash";
import { autorun } from "mobx";

import { requestNavigateToList } from "@aca/desktop/bridge/navigation";
import { ApplicationTrayList, applicationTrayStateBridge } from "@aca/desktop/bridge/tray";
import { groupBy } from "@aca/shared/groupBy";

import { getObservedDarkMode } from "../../darkMode";
import { getMainWindow } from "../../windows/mainWindow";
import { listIcons, trayIcons } from "./icons";

function showApp() {
  getMainWindow().show();
}

function convertListInfoToContextMenuItem(list: ApplicationTrayList, index: number): MenuItemConstructorOptions {
  const isDarkMode = getObservedDarkMode();

  function getLabel() {
    if (!list.count) return list.name;

    return `${list.name} (${list.count})`;
  }
  return {
    label: getLabel(),
    accelerator: index > 9 ? undefined : `${index}`,
    icon: isDarkMode ? listIcons.folderLight : listIcons.folder,
    acceleratorWorksWhenHidden: false,
    click() {
      showApp();
      requestNavigateToList.send({ listId: list.id });
    },
  };
}

function createSeparator(): MenuItemConstructorOptions {
  return { type: "separator" };
}

function updateContextMenu(tray: Tray, lists: ApplicationTrayList[]) {
  const items: MenuItemConstructorOptions[] = [
    {
      label: "Open Acapela",
      acceleratorWorksWhenHidden: false,
      click() {
        showApp();
      },
    },
  ];

  const groups = groupBy(
    lists,
    (list) => list.group,
    (group) => group ?? "no-list"
  );

  let listIndex = 0;

  for (const group of groups) {
    items.push(createSeparator());

    const sortedItems = sortBy(group.items, (item) => item.order);

    items.push(...sortedItems.map((item) => convertListInfoToContextMenuItem(item, ++listIndex)));
  }

  items.push(createSeparator(), { label: "Quit Acapela", role: "quit" });

  const contextMenu = Menu.buildFromTemplate(items);
  tray.setContextMenu(contextMenu);
}

export function initializeTrayHandlers() {
  const isDarkMode = getObservedDarkMode();

  const tray = new Tray(isDarkMode ? trayIcons.light : trayIcons.dark);

  autorun(() => {
    // Don't remove this - otherwise it will not be observed
    const isDarkMode = getObservedDarkMode();
    const { lists, shouldShowIndicator } = applicationTrayStateBridge.get();

    if (shouldShowIndicator) {
      tray.setImage(isDarkMode ? trayIcons.lightIndicator : trayIcons.darkIndicator);
    } else {
      tray.setImage(isDarkMode ? trayIcons.light : trayIcons.dark);
    }

    updateContextMenu(tray, lists);
  });
}
