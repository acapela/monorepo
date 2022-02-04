import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";

import { getNullableDb } from "@aca/desktop/clientdb";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { theme } from "@aca/ui/theme";

import { DebugFocusView } from "./DebugFocusView";

export const DebugView = observer(() => {
  const db = getNullableDb();

  if (!db) return null;
  return (
    <BodyPortal>
      {devSettingsStore.debugFocus && (
        <UIPanel>
          <DebugFocusView />
        </UIPanel>
      )}
    </BodyPortal>
  );
});

const UIPanel = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9;
  ${theme.colors.layout.actionPanel.asBgWithReadableText};
  ${theme.box.popover};
  width: 180px;
  ${theme.radius.panel};
`;
