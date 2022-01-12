import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react";
import { memo } from "react";
import styled, { css } from "styled-components";

import { formatMsTimeToPlaybackTime } from "@aca/shared/time";
import { TranscriptWord as TranscriptWordType } from "@aca/shared/types/transcript";
import { theme } from "@aca/ui/theme";

interface Props {
  word: TranscriptWordType;
  isActive: boolean;
  isFirstActive: boolean;
  isLastActive: boolean;
  onClick: (word: TranscriptWordType) => void;
}

export const TranscriptWord = memo(
  observer(function TranscriptWord({ word, isActive, onClick, isFirstActive, isLastActive }: Props) {
    const { text } = word;

    function formatWord() {
      return text.trim() + " ";
    }

    return (
      <UIHolder onClick={() => onClick(word)}>
        <UIWord data-tooltip={formatMsTimeToPlaybackTime(word.start_time)}>{formatWord()}</UIWord>
        <AnimatePresence>
          {isActive && (
            <UIActiveWordHighlight
              initial={{ opacity: 0, x: -5, scaleY: 0.6 }}
              animate={{ opacity: 1, transition: { duration: 0.2 }, x: 0, scaleY: 1 }}
              exit={{ opacity: 0, transition: { duration: 1 }, x: 5 }}
              isFirstActive={isFirstActive}
              isLastActive={isLastActive}
            />
          )}
        </AnimatePresence>
      </UIHolder>
    );
  })
);

const UIHolder = styled.div`
  position: relative;
  cursor: pointer;

  ${theme.transitions.hover()}
  &:hover {
    background-color: ${theme.colors.layout.background.border};
  }
`;

const UIWord = styled.span`
  position: relative;
  z-index: 2;
`;

const BORDER_RADIUS = 4;

const UIActiveWordHighlight = styled(motion.div)<{ isFirstActive: boolean; isLastActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  transition: 0.5s border-radius;

  ${(props) => {
    const shouldTransitionBorderRadiusQuickly = props.isFirstActive || props.isLastActive;

    if (shouldTransitionBorderRadiusQuickly) {
      return css`
        transition: 0.2s border-radius;
      `;
    }

    return css`
      transition: 1s border-radius;
    `;
  }}

  ${(props) =>
    props.isFirstActive &&
    css`
      border-top-left-radius: ${BORDER_RADIUS}px;
      border-bottom-left-radius: ${BORDER_RADIUS}px;
    `}

  ${(props) =>
    props.isLastActive &&
    css`
      border-top-right-radius: ${BORDER_RADIUS}px;
      border-bottom-right-radius: ${BORDER_RADIUS}px;
    `}

  /**
   * We need bg color to not be transparent as it'd be very visible when multiple words are animating next to each other.
   * Our current theme has no easy was of doing primary>lighten, so I'm inlining the color.
   */
  background-color: ${theme.colors.action.link};
`;
