import { RefObject, useEffect, useState } from "react";
import { createCleanupObject } from "~shared/cleanup";
import { createElementEvent } from "~shared/domEvents";
import { useBoolean } from "~shared/hooks/useBoolean";
import { createLocalStorageValueManager } from "~shared/localStorage";
import { MediaElement } from "./types";

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
