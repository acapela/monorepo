import styled, { css } from "styled-components";

import { useBoolean } from "~shared/hooks/useBoolean";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";

import { OptionsButtonWithMenu } from "./OptionsButtonWithMenu";

interface Props {
  options: PopoverMenuOption[];
  tooltip?: string;
}

export function CornerOptionsMenu({ options, tooltip }: Props) {
  const [isOpened, { set: markOpened, unset: unmarkOpened }] = useBoolean(false);

  return (
    <UIMenuIcon forceVisible={isOpened}>
      <OptionsButtonWithMenu options={options} tooltip={tooltip} onOpen={markOpened} onClose={unmarkOpened} />
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
