import { addMilliseconds } from "date-fns";
import { motion, useSpring } from "framer-motion";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import { niceFormatTime } from "@aca/shared/dates/format";
import { createMobxTick } from "@aca/shared/mobx/time";
import { MINUTE, SECOND } from "@aca/shared/time";
import { theme } from "@aca/ui/theme";

interface Props {
  all: number;
  done: number;
  title: string;
  avgTimePerItem: number;
}

function getDurationLabel(ms: number) {
  const minutes = Math.floor(ms / 1000 / 60 + 1);

  if (minutes < 59) {
    return `${minutes}min`;
  }

  const hours = Math.floor(minutes / 60);
  const minutesInHour = minutes % 60;

  return `${hours}h ${minutesInHour}m`;
}

function useAnimatedNumber(value: number, integer = true) {
  const springValue = useSpring(value);

  const [resultValue, setResultValue] = useState(value);

  useEffect(() => {
    return springValue.onChange((value) => {
      setResultValue(integer ? Math.floor(value) : value);
    });
  });

  useEffect(() => {
    springValue.set(value);
  }, [value]);

  return resultValue;
}

const updateTick = createMobxTick(SECOND * 15);

export const ProgressBar = observer(function ProgressBar({ all, done, title, avgTimePerItem }: Props) {
  const percentage = (done / all) * 100;

  const remaining = all - done;

  const isAllDone = remaining === 0;

  const msTillDone = Math.max(MINUTE, avgTimePerItem * remaining);

  const msTillDoneSpring = useAnimatedNumber(msTillDone);

  const remainingTimeLabel = getDurationLabel(msTillDoneSpring);

  updateTick.reportObserved();

  const estTimeEnd = addMilliseconds(new Date(), msTillDoneSpring);

  return (
    <UIHolder>
      <UIHead>
        <UITitle data-tooltip={title}>{title}</UITitle>
        <UIStats
          data-tooltip={
            !isAllDone ? `Est. finish time ${niceFormatTime(estTimeEnd)} (${remainingTimeLabel} left)` : undefined
          }
        >
          {done} / {all} {!isAllDone && <UITimeRemaining>({remainingTimeLabel})</UITimeRemaining>}
        </UIStats>
      </UIHead>
      <UIBarBg>
        <UIBar animate={{ x: `${-100 + percentage}%` }} initial={{ x: `${-100 + percentage}%` }} />
      </UIBarBg>
    </UIHolder>
  );
});

const labels = theme.typo.content.size(13).semibold;

const UIHolder = styled.div`
  max-width: 200px;
  min-width: 150px;
`;

const UIHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UITitle = styled.div`
  ${labels};
  flex-grow: 1;
  ${theme.common.ellipsisText}
`;

const BAR_HEIGHT = 6;

const barLayoutBase = css`
  width: 100%;
  min-width: 140px;
  height: ${BAR_HEIGHT}px;
  ${theme.radius.circle}
`;

const UIBarBg = styled.div`
  ${barLayoutBase};
  ${theme.colors.layout.backgroundAccent.asBg};
  position: relative;
  overflow: hidden;
  /* border: 1px solid ${theme.colors.primary.opacity(0.2)}; */
  box-sizing: content-box;
`;

const UIBar = styled(motion.div)`
  ${barLayoutBase};
  ${theme.colors.primary.secondary.asBg}
`;

const UIStats = styled.div`
  ${labels.opacity(0.5)};
  white-space: nowrap;
`;

const UITimeRemaining = styled.span``;
