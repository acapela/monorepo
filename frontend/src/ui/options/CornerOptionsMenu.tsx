import styled from "styled-components";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { IconButton } from "~ui/buttons/IconButton";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { OptionsButton } from "./OptionsButton";

interface Props {
  options: PopoverMenuOption[];
  tooltip?: string;
}

export function CornerOptionsMenu({ options, tooltip }: Props) {
  return (
    <UIMenuIcon>
      <PopoverMenuTrigger options={options}>
        <OptionsButton tooltip={tooltip} />
      </PopoverMenuTrigger>
    </UIMenuIcon>
  );
}

const UIMenuIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: inherit;
  cursor: pointer;
  transition: 0.2s opacity;

  * > & {
    opacity: 0;
  }

  *:hover > & {
    opacity: 1;
  }

  ${IconButton} {
    color: inherit;
  }
`;
