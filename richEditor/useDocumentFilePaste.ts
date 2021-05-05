import { useEffect } from "react";
import { createDocumentEvent } from "~shared/domEvents";

let isAnyWatchingForPaste = false;

export function useDocumentFilesPaste(onFilesPaste?: (files: File[]) => void) {
  useEffect(() => {
    if (isAnyWatchingForPaste) {
      console.warn(`Multiple useDocumentFilePaste cannot be runnign at once`);
      return;
    }

    isAnyWatchingForPaste = true;

    const stopWatching = createDocumentEvent("paste", (event) => {
      const items = event.clipboardData?.items;

      if (!items) return;

      const files: File[] = [];

      for (const item of items) {
        if (item.kind !== "file") continue;

        const itemFile = item.getAsFile();

        if (!itemFile) continue;

        files.push(itemFile);
      }

      if (files.length === 0) return;

      onFilesPaste?.(files);
    });

    return () => {
      isAnyWatchingForPaste = false;
      stopWatching();
    };
  }, [onFilesPaste]);
}
