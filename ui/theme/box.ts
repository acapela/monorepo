import { box as createBox } from "./utils/box";

export const box = {
  control: {
    regular: createBox({ x: 12, height: 36, gap: 10, radius: 6 }),
    compact: createBox({ x: 8, height: 28, gap: 10, radius: 6 }),
    sidebar: createBox({ x: 16, height: 28, gap: 10, radius: 6 }),
    compactWide: createBox({ x: 12, height: 28, width: 46, gap: 10, radius: 6 }),
  },
  items: {
    selectItem: createBox({ x: 12, height: 36, gap: 10, radius: 4 }),
    primarySelectItem: createBox({ x: 24, height: 48, gap: 16, radius: 4 }),
    listRow: createBox({ x: 8, height: 48, gap: 16, radius: 4 }),
    heroItem: createBox({ x: 12, y: 12, gap: 10, radius: 8 }),
  },
  panel: {
    toast: createBox({ x: 20, y: 15, radius: 8 }),
    primaryPopover: createBox({ x: 20, y: 20, radius: 8 }),
    pageCart: createBox({ x: 20, y: 20, radius: 8 }),
    tooltip: createBox({ x: 12, y: 10, gap: 10, radius: 4 }),
    hint: createBox({ x: 14, y: 6, gap: 10, radius: 4 }),
    badge: createBox({ x: 6, y: 3, gap: 10, radius: 10 }),
    shortcut: createBox({ x: 4, y: 4, radius: 4 }),
  },
};
