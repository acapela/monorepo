import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { OptionLabel } from "./OptionLabel";

export const SelectedOptionPreview = styled(OptionLabel)`
  background-color: #f4f6f8;
  padding: 4px;
  padding-right: 12px;
  min-height: 32px;
  white-space: nowrap;
  ${borderRadius.circle};
`;
