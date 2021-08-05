import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useInterval } from "react-use";
import styled from "styled-components";
import { PopPresenceAnimator } from "~ui/animations";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { theme } from "~ui/theme";

interface CountdownParams {
  seconds: number;
  onFinished: () => void;
  onCancelled: () => void;
}

export const FullScreenCountdown = ({ seconds: startFrom, onFinished, onCancelled }: CountdownParams) => {
  const [seconds, setSeconds] = useState(startFrom);

  useInterval(() => {
    const newSeconds = seconds - 1;

    if (newSeconds === 0) {
      onFinished();
    } else {
      setSeconds((seconds) => seconds - 1);
    }
  }, 1000);

  return (
    <ScreenCover isTransparent={false} onCloseRequest={onCancelled}>
      <AnimatePresence exitBeforeEnter>
        <UICounter key={seconds}>{seconds}</UICounter>
      </AnimatePresence>
    </ScreenCover>
  );
};

const UICounter = styled(PopPresenceAnimator)`
  color: ${theme.colors.interactive.actions.primary.regular.text()};
  ${theme.font.spezia.withExceptionalSize("6rem", "This needs to be very large and centered").build}
`;
