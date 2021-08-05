import { RefObject, useEffect, useState } from "react";
import styled from "styled-components";
import { createCleanupObject } from "~frontend/../../shared/cleanup";
import { createElementEvent } from "~frontend/../../shared/domEvents";
import { useBoolean } from "~frontend/../../shared/hooks/useBoolean";
import { useSharedRef } from "~frontend/../../shared/hooks/useSharedRef";
import { createLocalStorageValueManager } from "~frontend/../../shared/localStorage";
import { namedForwardRef } from "~frontend/../../shared/react/namedForwardRef";
import { TranscriptData } from "~shared/types/transcript";
import { PlaybackControls } from "./PlaybackControls";
import { MediaElement } from "./types";

interface Props {
  fileUrl: string;
  transcript?: TranscriptData;
}

/**
 * Let's remember user settings for playback rate and also automatically set it for all other players
 */
const playbackRateSettingManager = createLocalStorageValueManager("media-playback-rate", 1);

export function usePlaybackState(ref: RefObject<MediaElement>) {
  const [time, setTime] = useState(0);
  const playbackRate = playbackRateSettingManager.useValue();
  const setPlaybackRate = playbackRateSettingManager.set;
  const [duration, setDuration] = useState(Infinity);
  const [isPlaying, { set: play, unset: pause }] = useBoolean(false);

  const progress = time / duration;

  useEffect(() => {
    if (!ref.current) return;
    if (isPlaying) {
      ref?.current?.play();
    } else {
      ref?.current?.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (ref.current) {
      ref.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    const media = ref.current;
    if (!media) {
      return;
    }

    const cleanup = createCleanupObject();

    cleanup.enqueue(
      createElementEvent(media, "timeupdate", () => {
        setTime(media.currentTime);
      }),
      createElementEvent(media, "loadedmetadata", () => {
        console.log("elo", media.duration);
        setDuration(media.duration);
      }),
      createElementEvent(media, "play", play),
      createElementEvent(media, "pause", play),
      createElementEvent(media, "ended", pause),
      createElementEvent(media, "durationchange", () => {
        setDuration(media.duration);
      })
    );

    return cleanup.clean;
  }, [ref]);

  return {
    time,
    setTime,
    duration,
    setDuration,
    playbackRate,
    setPlaybackRate,
    isPlaying,
    play,
    pause,
    progress,
  };
}
