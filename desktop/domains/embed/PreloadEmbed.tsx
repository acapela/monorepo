import React, { useEffect } from "react";

import { requestEmbedPreload } from "@aca/desktop/bridge/preview";
import { PreviewLoadingPriority } from "@aca/desktop/domains/embed/index";

type Props = { url: string; priority?: PreviewLoadingPriority };

export function PreloadEmbed({ url, priority = PreviewLoadingPriority.following }: Props) {
  useEffect(() => {
    return requestEmbedPreload({ url, priority });
  }, [url, priority]);

  return <></>;
}
