import { requestPreviewPreload } from "@aca/desktop/bridge/preview";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import React, { useEffect } from "react";

type Props = { url: string; priority?: PreviewLoadingPriority };

export function PreloadNotificationPreview({ url, priority = PreviewLoadingPriority.following }: Props) {
  useEffect(() => {
    return requestPreviewPreload({ url, priority });
  }, [url, priority]);

  return <></>;
}
