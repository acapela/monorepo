import styled from "styled-components";
import { POP_ANIMATION_CONFIG } from "~ui/animations";
import { fontSize } from "~ui/baseStyles";
import { DANGER_COLOR } from "~ui/colors";
import { PresenceAnimator } from "~ui/PresenceAnimator";

interface Props {
  message: string;
}

export function InputError({ message }: Props) {
  return (
    <UIHolder
      transition={POP_ANIMATION_CONFIG}
      presenceStyles={{ opacity: [0, 1], height: [0, "auto"], marginTop: [0, 4] }}
    >
      {message}
    </UIHolder>
  );
}

const UIHolder = styled(PresenceAnimator)`
  color: ${DANGER_COLOR};
  font-size: ${fontSize.label};
`;
