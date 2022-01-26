import { pick } from "lodash";
import React, { useEffect, useRef, useState } from "react";

import {
  hideBrowserView,
  registerBrowserViewPreload,
  showBrowserView,
  unregisterBrowserViewPreload,
} from "@aca/desktop/bridge/preview";
import { useConst } from "@aca/shared/hooks/useConst";
import { useResizeCallback } from "@aca/shared/hooks/useResizeCallback";
import { getUUID } from "@aca/shared/uuid";

type BrowserViewProps = { url: string };

const useUUID = () => useConst(() => getUUID());

export function PreloadBrowserView({ url }: BrowserViewProps) {
  const id = useUUID();
  useEffect(() => {
    registerBrowserViewPreload({ url, id });
    return () => {
      unregisterBrowserViewPreload({ url, id });
    };
  }, [url]);

  return <></>;
}

export function BrowserViewBridge({ url }: BrowserViewProps) {
  const id = useUUID();
  const [bounds, setBounds] = useState<Electron.Rectangle | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useResizeCallback(rootRef, (entry) => {
    setBounds(pick(entry.target.getBoundingClientRect(), ["width", "height", "x", "y"]));
  });

  useEffect(() => {
    if (!bounds) {
      return;
    }
    showBrowserView({ url, id, bounds });
  }, [url, id, bounds]);

  useEffect(() => {
    return () => {
      hideBrowserView({ url, id });
    };
  }, [url, id]);

  return <div ref={rootRef} style={{ minHeight: 600, width: "100%" }} />;
}
