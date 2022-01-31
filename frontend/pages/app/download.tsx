import axios from "axios";
import React, { useEffect, useState } from "react";

import { useCurrentUserTokenData } from "@aca/frontend/authentication/useCurrentUser";
import { FocusedActionLayout } from "@aca/frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { openInNewTab } from "@aca/frontend/utils/openInNewTab";
import { PageMeta } from "@aca/frontend/utils/PageMeta";
import { LoginOptionsView } from "@aca/frontend/views/LoginOptionsView";
import { Button } from "@aca/ui/buttons/Button";

export default function LoginPage(): JSX.Element {
  const user = useCurrentUserTokenData();
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`/api/app-download-url`).then((response) => {
      const fetchedURL = response.data.downloadURL;

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
        {!user && <LoginOptionsView />}
        {!!user && (
          <Button kind="primary" onClick={handleDownload} isDisabled={downloadURL === null}>
            Download (MacOS)
          </Button>
        )}
      </FocusedActionLayout>
    </>
  );
}
