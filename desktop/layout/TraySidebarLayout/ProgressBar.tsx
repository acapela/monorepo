import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  progressPercent: number;
}

export function ProgressBar({ progressPercent }: Props) {
  return (
    <UIProgressBar>
      <UIProgressBarIndicator
        animate={{
          scaleX: progressPercent / 100,
        }}
      />
    </UIProgressBar>
  );
}

const UIProgressBar = styled.div`
  height: 4px;
  ${theme.colors.layout.backgroundAccent.hover.asBg};
  border-radius: 2px;
  overflow: hidden;
  width: 100%;
`;
const UIProgressBarIndicator = styled(motion.div)`
  ${theme.colors.primary.asBg};
  height: inherit;
  width: 100%;
  transform-origin: left;
`;
