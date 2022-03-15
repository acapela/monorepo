import { SystemMenuItemData, addSystemMenuItem, systemMenuItemClicked } from "@aca/desktop/bridge/systemMenu";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { removeElementFromArray } from "@aca/shared/array";
import { Menu, MenuItem, app } from "electron";

const log = makeLogger("System Menu");

function getOrCreateMenuItemParent(menu: Menu, path: string[]) {
  // if (!menu) return;

  const [rootLabel, ...subLabels] = path;

  let rootItem = menu.items.find((item) => item.label === rootLabel);

  if (!rootItem) {
    rootItem = new MenuItem({ label: rootLabel, submenu: [] });
    menu.items.push(rootItem);
  }

  let targetItem = rootItem;

  for (const nextPathLabel of subLabels) {
    const existingItem = targetItem.submenu!.items.find((item) => item.label === nextPathLabel);

    if (existingItem) {
      targetItem = existingItem;
    } else {
      const newItem = new MenuItem({ label: nextPathLabel, submenu: [] });

      targetItem = newItem;
    }
  }

  return [menu, targetItem] as const;
}

const registeredItems: SystemMenuItemData[] = [];

function updateMenu() {
  const newMenu = Menu.buildFromTemplate([]);

  for (const nextItem of registeredItems) {
    const [menu, itemParent] = getOrCreateMenuItemParent(newMenu, nextItem.path);
    const { id, label, path, isChecked, shortcut } = nextItem;

    const menuItem = new MenuItem({
      id,
      label,
      checked: isChecked,
      click: () => {
        systemMenuItemClicked.send(nextItem);
      },
    });

    itemParent.submenu!.append(menuItem);
  }

  console.log(newMenu);

  Menu.setApplicationMenu(newMenu);
}

export function initializeSystemMenuHandlers() {
  addSystemMenuItem.handle((itemData) => {
    registeredItems.push(itemData);

    updateMenu();

    return () => {
      removeElementFromArray(registeredItems, itemData);

      updateMenu();
    };
  });
}
