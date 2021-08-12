import styled from "styled-components";

import { fontSize } from "~ui/baseStyles";
import { PresenceAnimator } from "~ui/PresenceAnimator";
import { DANGER_COLOR } from "~ui/theme/colors/base";

interface Props {
  message: string;
}

export function InputError({ message }: Props) {
  return <UIHolder presenceStyles={{ opacity: [0, 1], height: [0, "auto"], marginTop: [0, 4] }}>{message}</UIHolder>;
}

const UIHolder = styled(PresenceAnimator)<{}>`
  color: ${DANGER_COLOR};
  font-size: ${fontSize.label};
`;
