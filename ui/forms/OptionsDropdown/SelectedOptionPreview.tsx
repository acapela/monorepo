import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { SELECTED_ITEM_COLOR } from "~ui/theme/colors/base";
import { OptionLabel } from "./OptionLabel";

export const SelectedOptionPreview = styled(OptionLabel)<{}>`
  background-color: ${SELECTED_ITEM_COLOR};
  padding: 4px;
  padding-right: 12px;
  min-height: 32px;
  white-space: nowrap;
  ${borderRadius.circle};
`;
