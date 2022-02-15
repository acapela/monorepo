import styled from "styled-components";

import { theme } from "@aca/ui/theme";

import { OptionLabel } from "./OptionLabel";

export const SelectedOptionPreview = styled(OptionLabel)<{}>`
  ${theme.typo.label.medium}
  ${theme.common.ellipsisText};
`;
