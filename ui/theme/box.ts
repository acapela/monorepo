import { box as createBox } from "./utils/box";

export const box = {
  button: createBox(15, 13, 10, 10),
  compactButton: createBox(12, 9, 10, 10),
  squareButton: createBox(8, 8),
  selectOption: createBox(10, 6),
  item: createBox(10, 10),
  label: createBox(10, 4),
  linkButton: createBox(7, 4),

  popover: createBox(10, 10),
  previewPopover: createBox(20, 20),
  pageCart: createBox(30, 30),
  buttonsGroup: createBox(4, 4),
  hint: createBox(4, 4),
};
