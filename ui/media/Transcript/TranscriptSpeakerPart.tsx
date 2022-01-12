import { observer } from "mobx-react";
import styled from "styled-components";

import { useLastValue } from "@aca/shared/hooks/useLastValue";
import { useMethod } from "@aca/shared/hooks/useMethod";
import {
  TranscriptSpeakerPart as TranscriptSpeakerPartType,
  TranscriptWord as TranscriptWordType,
} from "@aca/shared/types/transcript";

import { TranscriptWord } from "./TranscriptWord";

interface Props {
  part: TranscriptSpeakerPartType;
  time: number;
  onTimeChangeRequest: (time: number) => void;
}

function isNumberBetween(input: number, min: number, max: number) {
  return input >= min && input < max;
}

export const TranscriptSpeakerPart = observer(function TranscriptSpeakerPart({
  part,
  time,
  onTimeChangeRequest,
}: Props) {
  const { words } = part;

  /**
   * We want to highlight every single word at some point during the playback.
   *
   * This is however very possible that we'll skip some short words, especially if player has high playback rate.
   *
   * Imagine 3 words with their time position (start time)
   * [0s]Hello [0.3s]sweet [0.6s]word
   *
   * now, it is possible that we'll get media time update eg from time of 0.25s to time of 0.65s, as those updates are discrete.
   * In such case we'd skip highlighting middle word.
   *
   * To avoid that, we remember previous time we had from media and highlight all the words that are in between prev-time<>now-time
   */
  const previousTime = useLastValue(time);

  const handleWordClick = useMethod((word: TranscriptWordType) => {
    /**
     * When word is clicked, we move the time a bit before of it, so it's easier to actually
     * hear it.
     */
    const targetTime = Math.max(0, word.start_time - 0.5);
    onTimeChangeRequest(targetTime);
  });

  function getIsWordActive(word: TranscriptWordType) {
    if (isNumberBetween(time, word.start_time, word.end_time)) return true;

    if (previousTime === null) return false;

    const timeUpdateDuration = Math.abs(time - previousTime);

    /**
     * Playback time change bigger than 1s in one 'tick' must be caused by user manually changing the time of the playback.
     *
     * In such case we don't want to highlight all the words in between previous and current time
     */
    if (timeUpdateDuration > 1) return false;

    /**
     * Check if word is between previous media time and current media time
     */
    if (isNumberBetween(word.start_time, previousTime, time)) return true;
    if (isNumberBetween(word.end_time, previousTime, time)) return true;

    return false;
  }

  /**
   * Very often we display multiple words as highlighted at once.
   *
   * It is due to 2 reasons:
   * 1. 1+ words are between previous media time and current media time
   * 2. We slowly animate previously highlighted words away so they're still highlighted for a moment.
   *
   * Thus, we want to properly adjust border radius of word highlight:
   * [word 1][word 2]
   *
   * if both word 1 and word 2 are highlighted, we don't want to render border-radius between them.
   *
   * To do that, we prepare information for each word weather it is active or not, so later we can know for each word if
   * its next/previous sibling is active as well.
   */
  const wordsWithActiveInfo = words.map((word) => {
    return {
      word,
      isActive: getIsWordActive(word),
    };
  });
  return (
    <UIHolder>
      {wordsWithActiveInfo.map(({ word, isActive }, index) => {
        const key = `${word.start_time}`;

        const previousWord = wordsWithActiveInfo[index - 1];
        const nextWord = wordsWithActiveInfo[index + 1];

        const isFirstActive = isActive && !previousWord?.isActive;
        const isLastActive = isActive && !nextWord?.isActive;

        return (
          <TranscriptWord
            key={key}
            word={word}
            isActive={isActive}
            isFirstActive={isFirstActive}
            isLastActive={isLastActive}
            onClick={handleWordClick}
          />
        );
      })}
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-wrap: wrap;
  white-space: pre;
  line-height: 1.2;
`;
