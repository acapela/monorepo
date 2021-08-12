import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { createTimeout } from "~shared/time";
import { PopPresenceAnimator } from "~ui/animations";
import { theme } from "~ui/theme";

interface CountdownParams {
  seconds: number;
  onFinished: () => void;
  onCancelled: () => void;
}

export const FullScreenCountdown = ({ seconds: startFrom, onFinished, onCancelled }: CountdownParams) => {
  const [seconds, setSeconds] = useState(startFrom);

  useEffect(() => {
    if (seconds === 0) {
      onFinished();
    }

    return createTimeout(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
  }, [seconds]);

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
