import styled from "styled-components";
import { Button } from "./Button";
import { hoverActionCss } from "../transitions";

export const TransparentButton = styled(Button)`
  ${hoverActionCss}

  background-color: transparent;
  color: #474f5a;
`;
