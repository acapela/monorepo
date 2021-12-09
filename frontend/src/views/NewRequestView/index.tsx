import { computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAppStateStore } from "~frontend/appState/AppStateStore";
import { DropFileContext } from "~richEditor/DropFileContext";
import { theme } from "~ui/theme";

import { NewRequest, NewRequestProps } from "./NewRequest";

interface Props extends NewRequestProps {
  // We now have both /new page (before new dashboard lands) and modal.
  // They could technically be opened at once and as persisted state is in sync, editors content would be in sync
  // That could result in eg. double mention picker opened.
  _legacyHideIfCreatingInModal?: boolean;
}

export const NewRequestView = observer(function NewRequestView(props: Props) {
  const appState = useAppStateStore();

  const isCreatingNewRequestInModal = computed(() => appState.creatingNewTopic?.enabled).get();

  if (props._legacyHideIfCreatingInModal && isCreatingNewRequestInModal) return null;

  return (
    <>
      <UIDropFileHolder>
        <NewRequest {...props} />
      </UIDropFileHolder>
    </>
  );
});

const UIDropFileHolder = styled(DropFileContext)<{}>`
  height: 100%;
  width: 100%;
  ${theme.common.flexDiv}
`;
