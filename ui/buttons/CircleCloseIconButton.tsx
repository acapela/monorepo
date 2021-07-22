import { IconCross } from "~ui/icons";
import { Props as CircleIconButtonProps, CircleIconButton } from "./CircleIconButton";

export const CircleCloseIconButton = (props: Omit<CircleIconButtonProps, "icon">) => (
  <CircleIconButton size="medium" icon={<IconCross />} {...props} />
);
