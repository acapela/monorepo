import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { OptionLabel } from "./OptionLabel";

export const SelectedOptionPreview = styled(OptionLabel)`
  background-color: #f4f6f8;
  padding: 4px;
  padding-right: 12px;
  min-height: 32px;
  white-space: nowrap;
  ${borderRadius.circle};
`;
