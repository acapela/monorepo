import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { ScreenCover } from "~frontend/ui/Modal/ScreenCover";
import { createTimeout } from "~shared/time";
import { PopPresenceAnimator } from "~ui/animations";
import { theme } from "~ui/theme";

interface CountdownParams {
  seconds: number;
  onCancelled: () => void;
}

export const FullScreenCountdown = ({ seconds: startFrom, onCancelled }: CountdownParams) => {
  const [seconds, setSeconds] = useState(startFrom);

  useEffect(() => {
    return createTimeout(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  ${theme.font.size(60).bold.secondary}
`;
