import { useRef } from "react";

export function useAudioFile(fileUrl: string) {
  const fileRef = useRef<HTMLAudioElement | null>(null);

  function getOrCreateAudioFile() {
    if (fileRef.current) return fileRef.current;

    const audio = new Audio(fileUrl);

    fileRef.current = audio;

    return audio;
  }

  function play() {
    getOrCreateAudioFile().play();
  }

  function pause() {
    getOrCreateAudioFile().pause();
  }

  function stop() {
    //
  }
}
