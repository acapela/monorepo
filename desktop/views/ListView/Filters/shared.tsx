import styled from "styled-components";

import { theme } from "@aca/ui/theme";

export const UIAvatar = styled.div`
  height: 1em;
  width: 1em;
  ${theme.radius.circle};
  background-size: cover;
  background-color: #8884;
`;
