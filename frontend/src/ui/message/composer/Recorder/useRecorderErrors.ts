import { useMap } from "react-use";

import { MediaSource } from "./MediaSource";

export function useRecorderErrors() {
  const [map, { set: setKey }] = useMap<{ [key: string]: string | null }>({
    [MediaSource.Screen]: null,
    [MediaSource.Camera]: null,
    [MediaSource.Microphone]: null,
  });

  function set(mediaSource: MediaSource, error: string) {
    let errorStr = "";

    switch (error) {
      case "permission_denied":
        errorStr = `${mediaSource} access was denied for this page`;
        break;
      case "screen_capture_unsupported":
        errorStr = "Screen capture is not supported by your browser";
        break;
      default:
        errorStr = error;
        break;
    }

    setKey(mediaSource, errorStr);
  }

  function get(mediaSource: MediaSource): string | null {
    return map[mediaSource] ?? null;
  }

  return { set, get };
}
