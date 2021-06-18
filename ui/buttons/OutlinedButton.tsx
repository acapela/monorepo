import styled from "styled-components";
import { Button } from "./Button";
import { getButtonColorStyles } from "../transitions";
import { BACKGROUND_ACCENT } from "../colors";

export const OutlinedButton = styled(Button)`
  color: #474f5a;
  background: transparent;
  border: 1px solid ${BACKGROUND_ACCENT};
  ${getButtonColorStyles("#ffffff")}
`;
