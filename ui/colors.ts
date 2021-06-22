import { setColorOpacity } from "~shared/colors";

export const BLACK = "#000";
export const WHITE = "#fff";
export const BACKGROUND_ACCENT = "hsl(300, 2%, 92%)";
export const BACKGROUND_ACCENT_WEAK = "hsl(300, 2%, 97%)";
export const DANGER_COLOR = `hsl(0, 100%, 68%)`;
export const ACTIVE_COLOR = `hsl(250, 100%, 68%)`;
export const SUCCESS_COLOR = `hsla(149, 99%, 33%, 1)`;
export const HIGHLIGHT_COLOR = `hsl(47, 85%, 64%)`;
export const NOTIFICATION_COLOR = `hsl(352, 92%, 71%)`;
export const PRIMARY_COLOR = `hsl(296, 24%, 22%)`;
export const MODAL_BACKGROUND_COLOR = PRIMARY_COLOR;
export const ITEM_COVER_COLOR = setColorOpacity(PRIMARY_COLOR, 0.5);
export const BUTTON_BACKGROUND_COLOR = PRIMARY_COLOR;

/**
 * Those colors are in harmony with the rest of our colors, but are not neccessarily part of our design language.
 *
 * They might be used eg. for random gradients, avatar backgrounds etc.
 *
 * To modify, play with this palette: https://coolors.co/ff5c5c-775cff-ffd275-49beaa-311847-b8d8d8-5cc8ff-e6c0e9-1e1e24-82ff9e
 */
export const COLORS_PALETTE = {
  ORANGE_RED_CRAYOLA: "hsl(0, 100%, 68%)",
  MEDIUM_SLATE_BLUE: "hsl(250, 100%, 68%)",
  ORANGE_YELLOW_CRAYOLA: "hsl(40, 100%, 73%)",
  KEPPEL: "hsl(170, 47%, 52%)",
  RUSSIAN_VIOLET: "hsl(272, 49%, 19%)",
  POWDER_BLUE: "hsl(180, 29%, 78%)",
  MAYA_BLUE: "hsl(200, 100%, 68%)",
  PINK_LAVENDER: "hsl(296, 48%, 83%)",
  RAISIN_BLACK: "hsl(240, 9%, 13%)",
  MINT_GREEN: "hsl(133, 100%, 75%)",
};
