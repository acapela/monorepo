import { pickNArrayItemsWithSeed } from "~shared/array";
import { COLORS_PALETTE } from "~ui/colors";

const PALETTE_LIST = [...Object.values(COLORS_PALETTE)];

export function getSpaceColors(spaceId: string) {
  return pickNArrayItemsWithSeed(PALETTE_LIST, 2, spaceId);
}
