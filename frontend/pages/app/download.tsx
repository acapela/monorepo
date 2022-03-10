import axios from "axios";
import React, { useEffect, useState } from "react";

import { FocusedActionLayout } from "@aca/frontend/layouts/FocusedActionLayout/FocusedActionLayout";
import { openInNewTab } from "@aca/frontend/utils/openInNewTab";
import { PageMeta } from "@aca/frontend/utils/PageMeta";
import { Button } from "@aca/ui/buttons/Button";

type GitHubAsset = {
  browser_download_url: string;
  name: string;
};
export default function DownloadPage(): JSX.Element {
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`https://api.github.com/repos/weareacapela/releases/releases/latest`).then((response) => {
      const assets = response.data.assets as GitHubAsset[];
      const dmgAsset = assets.find((a) => a.name.endsWith("-universal.dmg"));
      if (!dmgAsset) return;
      setDownloadURL(dmgAsset.browser_download_url);
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
