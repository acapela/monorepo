import styled from "styled-components";
import { borderRadius } from "~ui/baseStyles";
import { BACKGROUND_ACCENT } from "~ui/colors";
import { OptionLabel } from "./OptionLabel";

export const SelectedOptionPreview = styled(OptionLabel)`
  background-color: ${BACKGROUND_ACCENT};
  padding: 8px;
  white-space: nowrap;
  ${borderRadius.item};
`;
