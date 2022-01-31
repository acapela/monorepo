import axios from "axios";
import React, { useEffect, useState } from "react";

import { FocusedActionLayout } from "@aca/frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { openInNewTab } from "@aca/frontend/utils/openInNewTab";
import { PageMeta } from "@aca/frontend/utils/PageMeta";
import { Button } from "@aca/ui/buttons/Button";

export default function LoginPage(): JSX.Element {
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`/api/app-download-url`).then((response) => {
      const fetchedURL = response.data.downloadURL;

      /**
       * We cannot 'start downloading' here as it is async and it is not trusted event.
       */

      setDownloadURL(fetchedURL);
    });
  });

  function handleDownload() {
    if (!downloadURL) return;

    openInNewTab(downloadURL);
  }

  return (
    <>
      <PageMeta title="Download Acapela" />
      <FocusedActionLayout title={`Download Acapela`} description={`Acapela helps you manage all your notifications`}>
        <Button kind="primary" onClick={handleDownload} isDisabled={downloadURL === null}>
          Download (MacOS)
        </Button>
      </FocusedActionLayout>
    </>
  );
}
