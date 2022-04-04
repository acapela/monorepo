import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { installUpdate } from "@aca/desktop/actions/app";
import { applicationStateBridge } from "@aca/desktop/bridge/system";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { theme } from "@aca/ui/theme";

import { ProgressBar } from "./ProgressBar";

export const SidebarUpdateInfo = observer(() => {
  const { isUpdateReadyToInstall, updateDownloadingPercent } = applicationStateBridge.get();

  function renderUpdateInfo() {
    if (updateDownloadingPercent !== null) {
      return (
        <UIUpdateInfoBox key="downloading">
          <UITitle>Update available</UITitle>
          <UIDescription>Downloading version of Acapela...</UIDescription>
          <ProgressBar progressPercent={updateDownloadingPercent} />
        </UIUpdateInfoBox>
      );
    }

    if (isUpdateReadyToInstall) {
      return (
        <UIUpdateInfoBox key="ready">
          <UITitle>Update ready to install</UITitle>
          <UIDescription>New version of Acapela is available.</UIDescription>
          <ActionButton action={installUpdate} kind="primary" />
        </UIUpdateInfoBox>
      );
    }
    return null;
  }

  return <AnimatePresence>{renderUpdateInfo()}</AnimatePresence>;
});

const UIUpdateInfoBox = styled(PopPresenceAnimator)`
  ${theme.box.panel.pageCart.padding.radius.vertical};
  align-items: flex-start;

  ${theme.colors.layout.backgroundAccent.asBgWithReadableText};

  ${ActionButton} {
    margin-top: 12px;
  }
`;

const UITitle = styled.div`
  ${theme.typo.content.semibold};
`;
const UIDescription = styled.div`
  ${theme.typo.label.secondary};
`;
