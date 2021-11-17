import { IconButton, IconButtonProps } from "~ui/buttons/IconButton";
import { IconMoreHoriz } from "~ui/icons";

/**
 * General "..." icon button used for ui consistency for all "Show options" buttons in the app.
 */
export function OptionsButton({ tooltip = "Show options...", ...buttonProps }: Omit<IconButtonProps, "icon">) {
  return <IconButton aria-haspopup tooltip={tooltip} icon={<IconMoreHoriz />} {...buttonProps} />;
}
