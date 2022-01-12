import styled from "styled-components";

import { theme } from "@aca/ui/theme";

import { OptionLabel } from "./OptionLabel";

export const SelectedOptionPreview = styled(OptionLabel)<{}>`
  ${theme.colors.primary.asBgWithReadableText};
  padding: 4px;
  padding-right: 12px;
  min-height: 32px;
  white-space: nowrap;
  ${theme.radius.circle};
`;
