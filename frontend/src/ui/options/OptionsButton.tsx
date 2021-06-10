import { IconMoreHoriz } from "~ui/icons";
import { IconButton } from "~ui/buttons/IconButton";

interface Props {
  onClick?: () => void;
  tooltip?: string;
}

/**
 * General "..." icon button used for ui consistency for all "Show options" buttons in the app.
 */
export function OptionsButton({ onClick, tooltip = "Show options..." }: Props) {
  return <IconButton onClick={onClick} tooltip={tooltip} icon={<IconMoreHoriz />} />;
}
