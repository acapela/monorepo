import styled, { css } from "styled-components";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { OptionsButton } from "./OptionsButton";
import { useBoolean } from "~shared/hooks/useBoolean";

interface Props {
  options: PopoverMenuOption[];
  tooltip?: string;
}

export function CornerOptionsMenu({ options, tooltip }: Props) {
  const [isOpened, { set: markOpened, unset: unmarkOpened }] = useBoolean(false);

  return (
    <UIMenuIcon forceVisible={isOpened}>
      <PopoverMenuTrigger options={options} onOpen={markOpened} onClose={unmarkOpened}>
        <OptionsButton tooltip={tooltip} />
      </PopoverMenuTrigger>
    </UIMenuIcon>
  );
}

const UIMenuIcon = styled.div<{ forceVisible: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: inherit;
  cursor: pointer;
  transition: 0.2s opacity;
  opacity: 1;

  ${(props) => {
    if (props.forceVisible) return;

    return css`
      /* Make me visible only if my direct parent is hovered */
      * > & {
        opacity: 0;
      }

      *:hover > & {
        opacity: 1;
      }
    `;
  }}
`;
