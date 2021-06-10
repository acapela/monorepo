import styled from "styled-components";
import { IconMoreHoriz } from "~frontend/../../ui/icons";
import { IconButton } from "~ui/buttons/IconButton";
import { PopoverMenu, PopoverMenuOptions } from "~ui/popovers/PopoverMenu";

interface Props {
  options: PopoverMenuOptions[];
  tooltip?: string;
}

export function CornerOptionsMenu({ options, tooltip }: Props) {
  return (
    <UIMenuIcon>
      <PopoverMenu options={options}>
        <IconButton tooltip={tooltip} icon={<IconMoreHoriz />} />
      </PopoverMenu>
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
