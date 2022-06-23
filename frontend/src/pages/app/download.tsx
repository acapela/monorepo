import { getLocation } from "@swan-io/chicane";
import axios from "axios";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import { Router } from "@aca/frontend/src/router";
import { openInNewTab } from "@aca/frontend/src/utils/openInNewTab";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { Button } from "@aca/ui/buttons/Button";
import { Logo } from "@aca/ui/icons/logos/AcapelaLogo";
import { phone } from "@aca/ui/responsive";
import { theme } from "@aca/ui/theme";

type GitHubAsset = {
  browser_download_url: string;
  name: string;
};

const videoRatio = 16 / 9;
const defaultVideoHeightInPixels = 420;

export default function DownloadPage(): JSX.Element {
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const { search } = getLocation();
  if (search.referral) {
    document.cookie = `referral=${search.referral};path=/`;
    Router.push("login", { redirect: "https://acapela.com/download" });
    return <></>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    axios.get(`https://api.github.com/repos/weareacapela/releases/releases/latest`).then((response) => {
      const assets = response.data.assets as GitHubAsset[];
      const dmgAsset = assets.find((a) => a.name.endsWith("-universal.dmg"));
      if (!dmgAsset) return;
      setDownloadURL(dmgAsset.browser_download_url);
    });
  }, []);

  function handleDownload() {
    if (!downloadURL) return;

    openInNewTab(downloadURL);
  }

  return (
    <>
      <UIWrapper>
        <UIWindow>
          <UIHead>
            <UILogo />
            <UITypo>
              <UITitle>Download Acapela</UITitle>
              <UIDescription>Acapela helps you manage all your notifications</UIDescription>
            </UITypo>
          </UIHead>
          <Button kind="primary" size="primary" onClick={handleDownload} isDisabled={downloadURL === null}>
            Download (MacOS)
          </Button>
        </UIWindow>
        <UIIFrameHolder>
          <iframe
            id="ytplayer"
            frameBorder="0"
            allowFullScreen
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            src="https://www.youtube.com/embed/-AauR0Q3Uzk?autoplay=1&origin=https://app.acape.la&enablejsapi=1"
          ></iframe>
        </UIIFrameHolder>
      </UIWrapper>
    </>
  );
}

const UIWrapper = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  ${theme.colors.layout.background.asBgWithReadableText};
`;

const UIWindow = styled(PopPresenceAnimator)<{}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 700px;
  min-width: 420px;
  margin-bottom: 64px;

  ${phone(css`
    min-width: 0;
    width: 100%;
  `)}
`;

const UIHead = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${theme.spacing.actionsSection.asGap};
  margin-bottom: 50px;
`;

const UITypo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  ${theme.spacing.close.asGap};
`;

const UITitle = styled.div`
  ${theme.typo.hero};
`;

const UIDescription = styled.div`
  ${theme.typo.body.medium.secondary};
  max-width: 40ch;
`;

const UILogo = styled(Logo)<{}>`
  ${theme.iconSize.hero};
`;

const UIIFrameHolder = styled.div<{}>`
  position: relative;
  display: flex;
  height: ${defaultVideoHeightInPixels}px;
  width: ${defaultVideoHeightInPixels * videoRatio}px;

  ${phone(css`
    min-width: 0;
    width: 90%;
  `)}
`;
