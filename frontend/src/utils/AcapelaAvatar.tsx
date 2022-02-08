import styled from "styled-components";

import { Logo } from "@aca/ui/icons/logos/AcapelaLogo";
import { theme } from "@aca/ui/theme";

interface Props {
  className?: string;
}

export const AcapelaAvatar = styled(function AcapelaAvatar({ className }: Props) {
  return (
    <UIHolder className={className}>
      <Logo />
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  ${theme.radius.circle};
  overflow: hidden;

  svg {
    font-size: calc(1em + 2px);
    margin: -1px;
  }
`;
