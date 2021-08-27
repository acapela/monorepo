import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { theme } from "~ui/theme";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = (props: InputProps) => (
  <UIPanel>
    <UIInput type="checkbox" {...props} />
    <UICircle animate={{ x: props.checked ? "100%" : "0%" }} />
  </UIPanel>
);

const UIPanel = styled.div<{}>`
  width: 32px;
  height: 16px;

  position: relative;

  border-radius: 48px;
  cursor: pointer;

  ${theme.colors.actions.primary.regular()}
`;

const UIInput = styled.input<InputProps>`
  position: absolute;
  left: 0;
  top: 0;

  appearance: none;
  width: 100%;
  height: 100%;
`;

const UICircle = styled(motion.div)`
  height: 100%;
  aspect-ratio: 1 / 1;
  background: white;
  border: 2px solid ${theme.colors.interactive.actions.primary.regular.background()};
  border-radius: 100%;
`;
