import { getFadeInAnimationStyles } from "../animations";

export const animations = {
  // Converts normal display: block to flex, without modifying its display flow.
  // Useful when stacking nested flex elements eg. to have dynamic height that does not overflow the screen.
  fade: getFadeInAnimationStyles(0.2),
};
