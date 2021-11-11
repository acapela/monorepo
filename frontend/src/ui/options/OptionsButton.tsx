import { IconButton } from "~ui/buttons/IconButton";
import { IconMoreHoriz } from "~ui/icons";

interface Props {
  onClick?: () => void;
  tooltip?: string;
}

/**
 * General "..." icon button used for ui consistency for all "Show options" buttons in the app.
 */
export function OptionsButton({ onClick, tooltip = "Show options..." }: Props) {
  return <IconButton aria-haspopup onClick={onClick} tooltip={tooltip} icon={<IconMoreHoriz />} />;
}
