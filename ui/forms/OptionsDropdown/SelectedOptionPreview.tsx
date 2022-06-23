import styled from "styled-components";

import { theme } from "@aca/ui/theme";

import { OptionLabel } from "./OptionLabel";

export const SelectedOptionPreview = styled(OptionLabel)<{}>`
  ${theme.typo.note.medium.resetLineHeight}
  ${theme.common.ellipsisText};
`;

export const CommaSelectedOptionsPreview = styled.div<{}>`
  ${theme.typo.body.medium};
  white-space: normal;
  display: flex;
  flex: 1;
  align-items: center;
  user-select: none;

  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
`;
