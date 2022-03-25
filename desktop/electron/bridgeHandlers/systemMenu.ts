import { Menu, MenuItemConstructorOptions, app, webContents } from "electron";
import { throttle } from "lodash";

import { SystemMenuItemData, addSystemMenuItem, systemMenuItemClicked } from "@aca/desktop/bridge/systemMenu";
import { removeElementFromArray } from "@aca/shared/array";
import { groupBy } from "@aca/shared/groupBy";

import { getMainView } from "../windows/mainWindow";
import { convertShortcutKeysToElectronShortcut } from "./utils/shortcuts";

function getDefaultSystemMenuTemplate() {
  const template: MenuItemConstructorOptions[] = [
    {
      label: app.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" },
      ],
    },

    {
      label: "Edit",
      submenu: [
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },

        { role: "pasteAndMatchStyle" },
        { role: "delete" },
        { role: "selectAll" },
        { type: "separator" },
        {
          label: "Speech",
          submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
        },
      ],
    },
    {
      label: "Window",
      submenu: [
        //
        { role: "close" },
      ],
    },

    {
      label: "Debug",
      submenu: [
        { role: "reload" },
        {
          label: "Reload all views",
          accelerator: "Shift+CommandOrControl+R",
          click() {
            webContents.getAllWebContents().forEach((webContents) => {
              webContents.reloadIgnoringCache();
            });
          },
        },
        {
          label: "Toggle developer tools",
          accelerator: "CommandOrControl+Alt+I",
          click() {
            getMainView().webContents.toggleDevTools();
          },
        },
      ],
    },
  ];

  return template;
}

function convertMenuItemDataToConstructorData(item: SystemMenuItemData): MenuItemConstructorOptions {
  const { id, label, isChecked, isDisabled, shortcut, group } = item;

  const accelerator = shortcut ? convertShortcutKeysToElectronShortcut(shortcut) : undefined;

  const menuItem: MenuItemConstructorOptions = {
    id,
    label,
    type: typeof isChecked === "boolean" ? "checkbox" : undefined,
    checked: isChecked,
    enabled: !isDisabled,
    accelerator,
    registerAccelerator: false,
    click(electronItem, window, event) {
      if (event.triggeredByAccelerator) return;

      systemMenuItemClicked.send(item);
    },
  };

  if (group) {
    itemGroupLabel.set(menuItem, group);
  }

  return menuItem;
}

function injectDelimitersForItemsGroups(menu: MenuItemConstructorOptions[]): MenuItemConstructorOptions[] {
  const menuWithChildrenGroupped = menu.map((item) => {
    const subMenu = item.submenu as MenuItemConstructorOptions[];

    if (!subMenu) return item;

    const subMenuItem: MenuItemConstructorOptions = {
      ...item,
      submenu: injectDelimitersForItemsGroups(subMenu),
    };

    const group = itemGroupLabel.get(item);

    if (group) {
      itemGroupLabel.set(subMenuItem, group);
    }

    return subMenuItem;
  });

  const directGroups = groupBy(
    menuWithChildrenGroupped,
    (item) => itemGroupLabel.get(item),
    (group) => group ?? "no-group"
  );

  if (directGroups.length === 1) {
    return menuWithChildrenGroupped;
  }

  const finalResults: MenuItemConstructorOptions[] = [];

  directGroups.forEach(({ items }, index) => {
    const isLast = index === directGroups.length - 1;
    finalResults.push(...items);

    if (!isLast) {
      finalResults.push({ type: "separator" });
    }
  });

  return finalResults;
}

const itemGroupLabel = new WeakMap<MenuItemConstructorOptions, string>();

function buildNewSystemMenu(items: SystemMenuItemData[]) {
  const menu = getDefaultSystemMenuTemplate();

  for (const item of items) {
    const { path, group } = item;

    const parent = getOrCreateMenuItemParent(menu, path, group);

    const subMenu = parent.submenu as MenuItemConstructorOptions[];

    const menuItem = convertMenuItemDataToConstructorData(item);

    subMenu.push(menuItem);
  }

  return injectDelimitersForItemsGroups(menu);
}

function getOrCreateMenuItemParent(root: MenuItemConstructorOptions[], path: string[], group?: string) {
  // if (!menu) return;

  const [rootLabel, ...subLabels] = path;

  let rootItem = root.find((item) => item.label === rootLabel);

  if (!rootItem) {
    const newItem: MenuItemConstructorOptions = {
      label: rootLabel,
      submenu: [],
    };

    if (group) {
      itemGroupLabel.set(newItem, group);
    }

    root.push(newItem);

    rootItem = newItem;
  }

  let target = rootItem;

  for (const subLabel of subLabels) {
    const subMenu = target.submenu as MenuItemConstructorOptions[];

    const existing = subMenu.find((item) => item.label === subLabel);

    if (existing) {
      target = existing;
    } else {
      const newItem: MenuItemConstructorOptions = { label: subLabel, submenu: [] };

      if (group) {
        itemGroupLabel.set(newItem, group);
      }

      subMenu.push(newItem);

      target = newItem;
    }
  }

  return target;
}

const registeredItems: SystemMenuItemData[] = [];

function updateMenu() {
  const template = buildNewSystemMenu(registeredItems);
  const newMenu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(newMenu);
}

const throttledUpdateMenu = throttle(updateMenu, 100, { leading: false, trailing: true });

export function initializeSystemMenuHandlers() {
  updateMenu();

  addSystemMenuItem.handle(async (itemData) => {
    registeredItems.push(itemData);

    throttledUpdateMenu();

    return () => {
      removeElementFromArray(registeredItems, itemData);

      throttledUpdateMenu();
    };
  });
}
