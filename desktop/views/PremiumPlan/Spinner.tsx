import styled, { keyframes } from "styled-components";

import { theme } from "@aca/ui/theme";

const spin = keyframes`
  
  to { transform: rotate(360deg); }
`;

export const UISpinner = styled.div`
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 0.1em solid ${theme.colors.primary.opacity(0.3).value};
  border-radius: 50%;
  border-top-color: ${theme.colors.primary.value};
  animation: ${spin} 1s ease-in-out infinite;
`;
