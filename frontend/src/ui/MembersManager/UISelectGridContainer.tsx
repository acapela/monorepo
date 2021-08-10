import styled from "styled-components";
import { theme } from "~ui/theme";

export const UISelectGridContainer = styled.div<{}>`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 100%;
  padding: 8px;
  border: 1px solid ${theme.colors.layout.softLine()};
  ${theme.borderRadius.menu}
`;
