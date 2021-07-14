import { setColorOpacity } from "~shared/colors";

/*
 *
 * Design Language colors
 *
 */

export const PRIMARY_PURPLE_1 = "hsl(297, 24%, 15%)";
export const PRIMARY_PURPLE_2 = "hsl(296, 24%, 22%)";
export const PRIMARY_PINK_1 = "hsl(344, 67%, 66%)";
export const PRIMARY_PINK_3 = "hsla(345, 51%, 59%, 1)";
export const PRIMARY_TEAL_1 = "hsl(180, 76%, 55%)";
export const SECONDARY_ORANGE_1 = "hsl(16, 86%, 52%)";
export const BASE_GREY_1 = "hsl(0, 2%, 12%)";
export const BASE_GREY_2 = "hsl(0, 1%, 21%)";
export const BASE_GREY_3 = "hsl(0, 0%, 47%)";
export const BASE_GREY_4 = "hsl(0, 0%, 82%)";
export const BASE_GREY_6 = "hsl(0, 0%, 96%)";
export const BASE_GREY_LINES = "hsl(0, 0%, 91%)";
export const CLOUD_LIGHTER = "hsl(210, 22%, 96%)";
export const DARK_ONYX = "hsl(213, 20%, 17%)";

/*
 *
 * Theme Colors
 *
 */
export const BLACK = "hsl(0, 0%, 0%)";
export const WHITE = "hsl(0, 0%, 100%)";
export const ITEM_BACKGROUND_WEAK = "hsl(0, 0%, 96%)";
export const ITEM_BACKGROUND_WEAK_TRANSPARENT = "hsla(0, 0%, 96%, 0.65)";
export const BACKGROUND_ACCENT = "hsl(300, 2%, 92%)";
export const BACKGROUND_ACCENT_WEAK = "hsl(300, 2%, 97%)";
export const SECONDARY_TEXT_COLOR = "hsl(0, 0%, 47%)";
export const DANGER_COLOR = `hsl(0, 100%, 68%)`;
export const ACTIVE_COLOR = `hsl(250, 100%, 68%)`;
export const SUCCESS_COLOR = `hsla(149, 99%, 33%, 1)`;
export const HIGHLIGHT_COLOR = `hsl(47, 85%, 64%)`;
export const NOTIFICATION_COLOR = `hsl(352, 92%, 71%)`;
export const PRIMARY_COLOR = PRIMARY_PURPLE_1;
export const PRIMARY_ACTIVE_COLOR = PRIMARY_PURPLE_2;
export const MODAL_BACKGROUND_COLOR = PRIMARY_COLOR;
export const ITEM_COVER_COLOR = setColorOpacity(PRIMARY_COLOR, 0.5);
export const BUTTON_BACKGROUND_COLOR = PRIMARY_COLOR;
export const BUTTON_BACKGROUND_ACTIVE_COLOR = PRIMARY_ACTIVE_COLOR;
export const BUTTON_ACCENT_COLOR = "hsl(209, 11%, 52%)";
export const WARNING_COLOR = SECONDARY_ORANGE_1;
export const SELECTED_ITEM_COLOR = CLOUD_LIGHTER;
export const STRONG_LINE_COLOR = "hsla(0, 0%, 82%, 1)";

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
