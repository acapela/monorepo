import styled from "styled-components";

import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

interface Props {
  message: string;
}

export function InputError({ message }: Props) {
  return <UIHolder presenceStyles={{ opacity: [0, 1], height: [0, "auto"], marginTop: [0, 4] }}>{message}</UIHolder>;
}

const UIHolder = styled(PresenceAnimator)<{}>`
  ${theme.typo.label};
  ${theme.colors.status.danger.asBg};
`;
