import { CircleIconButton } from "~ui/buttons/CircleIconButton";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { IconMoreHoriz } from "~ui/icons";

interface Props {
  onClick?: () => void;
  tooltip?: string;
}

/**
 * General "..." icon button used for ui consistency for all "Show options" buttons in the app.
 */
export function OptionsButton({ onClick, tooltip = "Show options..." }: Props) {
  return <WideIconButton kind="secondary" onClick={onClick} tooltip={tooltip} icon={<IconMoreHoriz />} />;
}

export function CircleOptionsButton({ onClick, tooltip = "Show options..." }: Props) {
  return <CircleIconButton kind="tertiary" onClick={onClick} tooltip={tooltip} icon={<IconMoreHoriz />} />;
}
