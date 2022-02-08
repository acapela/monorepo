import React from "react";
import styled from "styled-components";

import { clearAllDataRequest, restartAppRequest } from "@aca/desktop/bridge/system";
import { Button } from "@aca/ui/buttons/Button";

async function tryRestart() {
  try {
    await restartAppRequest();
  } catch (error) {
    window.location.reload();
  }
}

async function tryLogout() {
  await clearAllDataRequest();
}

export function ErrorRecoveryButtons() {
  return (
    <UIButtonsSet>
      <Button kind="primary" onClick={tryRestart}>
        Restart App
      </Button>
      <Button onClick={tryLogout}>Log in again</Button>
    </UIButtonsSet>
  );
}

const UIButtonsSet = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;

  ${Button} {
    flex-grow: 1;
  }
`;
