import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

import { OptionsButton } from "./OptionsButton";

interface Props {
  options: PopoverMenuOption[];
  onOpen?: () => void;
  onClose?: () => void;
  tooltip?: string;
}

export function OptionsButtonWithMenu({ options, tooltip, onOpen, onClose }: Props) {
  return (
    <PopoverMenuTrigger options={options} onOpen={onOpen} onClose={onClose}>
      <OptionsButton tooltip={tooltip} />
    </PopoverMenuTrigger>
  );
}
